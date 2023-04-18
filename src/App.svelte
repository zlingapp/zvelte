<script lang="ts">
    import type {
        Consumer,
        Producer,
        Transport,
    } from "mediasoup-client/lib/types";
    import VoiceChannel from "./components/VoiceChannel.svelte";
    import { auth_fetch, json_fetch } from "./lib/voice_api";

    import { Device } from "mediasoup-client";
    import { each } from "svelte/internal";

    let vc_members = [];

    let voice_status: string = null;
    let device: Device = null;

    let identity: string = null;
    let token: string = null;

    let socket: WebSocket = null;
    let heartbeat_handle: number = null;

    let send_transport: Transport = null;
    let producer: Producer = null;

    let local_stream: MediaStream = null;
    let local_analyzer: AnalyserNode = null;
    let speaking = false;

    let recv_transport: Transport = null;
    let consumers: Record<string, Consumer> = {};

    $: consumer_vals = Object.values(consumers);

    async function join() {
        if (identity || token) return;
        
        voice_status = "Authenticating...";

        let data = await json_fetch(`/api/join?c=test`);
        identity = data.identity;
        token = data.token;

        // voice_status = "Connecting Event Socket...";

        // create websocket url
        // wss or ws depending on secure
        let ws_url = new URL(
            `ws${location.protocol === "https:" ? "s" : ""}://${
                location.host
            }/api/ws/`,
            location.href
        );
        ws_url.searchParams.set("i", identity);
        ws_url.searchParams.set("t", token);

        // connect to websocket
        socket = new WebSocket(ws_url);

        socket.onopen = async () => {
            // carry on
            await initialize_producer(data.rtp);
        };
        socket.onclose = async () => {
            // reset
            console.log("Event socket closed!");
            await disconnect();
        };

        socket.onmessage = async (e) => {
            let data = JSON.parse(e.data);
            await on_server_event(data);
        };

        heartbeat_handle = setInterval(async () => {
            socket.send("heartbeat");
        }, 5000);
    }

    async function reset() {
        // vc_members = vc_members.filter((m) => m !== identity);
        vc_members = []; // uhh idk how we should handle seeing people already in vc

        identity = null;
        token = null;

        if (heartbeat_handle != null) {
            clearInterval(heartbeat_handle);
            heartbeat_handle = null;
        }

        if (socket) {
            if (socket.readyState === WebSocket.OPEN) {
                await socket.close();
            }
            socket = null;
        }

        if (send_transport && !send_transport.closed) {
            await send_transport.close();
            send_transport = null;
        }

        if (producer && !producer.closed) {
            await producer.close();
            producer = null;
        }

        // reset consumer stuff
        if (recv_transport && !recv_transport.closed) {
            await recv_transport.close();
            recv_transport = null;
        }

        Object.values(consumers).forEach(async (c) => {
            await c.close();
        });
        consumers = {};

        device = null;
    }

    async function disconnect() {
        if (!identity || !token) return;

        try {
            await auth_fetch(identity, token, `/api/leave`, null, false);
        } catch (e) {
            console.error("graceful disconnect failed,", e);
        }

        await reset();
        voice_status = "Disconnected";
    }

    async function initialize_send_transport() {
        // voice_status = "ST Creating..."; // ST = Send Transport
        send_transport = device.createSendTransport(
            await auth_fetch(
                identity,
                token,
                `/api/transport/create?type=send`,
                { method: "POST" }
            )
        );
        console.log("Send transport id: ", send_transport.id);

        send_transport.on(
            "connect",
            async ({ dtlsParameters }, callback, errback) => {
                try {
                    await auth_fetch(
                        identity,
                        token,
                        `/api/transport/connect?type=send`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ dtlsParameters }),
                        },
                        false
                    );
                    callback();
                } catch (e) {
                    console.error(e);
                    errback(e);
                }
            }
        );
        send_transport.on("connectionstatechange", async (state) => {
            console.log("SEND TRANSPORT Connection state change to ", state);
            switch (state) {
                case "connecting":
                    // voice_status = "Outbound Connecting...";
                    break;
                case "connected":
                    // voice_status = "Outbound Connected";
                    voice_status = "Connected";
                    break;
                case "failed":
                    voice_status = "Outbound Failed";
                    await reset();
                    break;
                case "disconnected":
                    // voice_status = "Outbound Disconnected";
                    break;
                case "closed":
                    console.log("Send Transport Closed");
                    await reset();
                    break;
            }
        });
        send_transport.on(
            "produce",
            async ({ kind, rtpParameters }, callback, errback) => {
                try {
                    console.log("Requesting producer...");
                    const { id } = await auth_fetch(
                        identity,
                        token,
                        `/api/produce`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ kind, rtpParameters }),
                        }
                    );
                    console.log("Producer id: ", id);
                    callback({ id });
                } catch (e) {
                    console.error(e);
                    errback(e);
                }
            }
        );
    }

    async function initialize_producer(routerRtpCapabilities) {
        voice_status = "Requesting device permission...";
        // produce
        local_stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
        });
        const track = local_stream.getAudioTracks()[0];

        voice_status = "RTC Connecting...";
        device = new Device();
        await device.load({ routerRtpCapabilities });

        await initialize_send_transport();
        await initialize_recv_transport();

        // voice_status = "Starting producer...";
        producer = await send_transport.produce({ track });

        const audioContext = new AudioContext();
        const mediaStreamSource =
            audioContext.createMediaStreamSource(local_stream);
        local_analyzer = audioContext.createAnalyser();
        local_analyzer.fftSize = 1024;
        local_analyzer.smoothingTimeConstant = 0;
        mediaStreamSource.connect(local_analyzer);

        setInterval(() => {
            speaking = isSoundDetected();
        }, 100);

        let peers = await auth_fetch(identity, token, "/api/peers");
        vc_members = peers.map((m) => m.identity);
        vc_members = [...vc_members, identity]; // add self

        // consume existing
        for (const peer of peers) {
            (async () => {
                for (const producerId of peer.producers) {
                    consume(peer.identity, producerId);
                }
            })();
        }
    }

    function isSoundDetected() {
        const bufferLength = local_analyzer.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        local_analyzer.getByteFrequencyData(dataArray);

        const threshold = 100;
        let soundDetected = false;

        for (let i = 0; i < bufferLength; i++) {
            if (dataArray[i] > threshold) {
                soundDetected = true;
                break;
            }
        }

        return soundDetected;
    }

    async function on_server_event(data: any) {
        switch (data.type) {
            case "client_connected":
                vc_members.push(data.identity);
                vc_members = vc_members;
                console.log("new client!");
                break;
            case "client_disconnected":
                vc_members = vc_members.filter((m) => m !== data.identity);
                
                consumers[data.identity].close();
                consumers[data.identity] = undefined;

                consumers = consumers;
                break;
            case "new_producer":
                // todo: consume me!
                console.log("New producer:", data, "starting consume...");
                await consume(data.identity, data.producer_id);
                break;
        }
    }

    async function initialize_recv_transport() {
        // voice_status = "RT Creating..."; // ST = Send Transport
        recv_transport = device.createRecvTransport(
            await auth_fetch(
                identity,
                token,
                `/api/transport/create?type=recv`,
                { method: "POST" }
            )
        );
        console.log("Recv transport id: ", recv_transport.id);

        recv_transport.on(
            "connect",
            async ({ dtlsParameters }, callback, errback) => {
                try {
                    await auth_fetch(
                        identity,
                        token,
                        `/api/transport/connect?type=recv`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ dtlsParameters }),
                        },
                        false
                    );
                    callback();
                } catch (e) {
                    console.error(e);
                    errback(e);
                }
            }
        );
        recv_transport.on("connectionstatechange", async (state) => {
            console.log("RECV TRANSPORT Connection state change to ", state);
            switch (state) {
                case "connecting":
                    // voice_status = "Inbound Connecting...";
                    break;
                case "connected":
                    // voice_status = "Inbound Connected";
                    break;
                case "failed":
                    voice_status = "Inbound Failed";
                    await reset();
                    break;
                case "disconnected":
                    // voice_status = "Inbound Disconnected";
                    break;
                case "closed":
                    console.log("Recv Transport Closed");
                    await reset();
                    break;
            }
        });
    }

    async function consume(peerIdentity: string, producerId: string) {
        // while (recv_transport == null) {
        //     await Promise.resolve();
        // }

        let consumer = await recv_transport.consume(
            await auth_fetch(identity, token, "/api/consume", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    producerId,
                    rtpCapabilities: device.rtpCapabilities,
                }),
            })
        );

        if (consumers[peerIdentity]) {
            console.warn("already have consumer for", peerIdentity);
        }
        consumers[peerIdentity] = consumer;
        consumers = consumers;
    }

    function srcObject(node, stream) {
        node.srcObject = stream;
        return {
            update(nextStream) {
                node.srcObject = stream;
            },
            destroy() {
                /* stream revoking logic here */
            },
        };
    }
</script>

<main>
    <div>
        {#each consumer_vals as c}
            <audio
                autoplay
                use:srcObject={(() => {
                    if (c == null) return; // happens
                    let stream = new MediaStream();
                    stream.addTrack(c.track);
                    return stream;
                })()}
            />
        {/each}
    </div>
    <div class="server-list" />

    <div class="sidebar">
        <div class="server-head">
            <p class="server-name">Server Name</p>
        </div>
        <div class="server-channels">
            <VoiceChannel onclick={() => join()} members={vc_members} />
        </div>
        <div class="user-controls">
            <p>{voice_status || "Disconnected"}</p>
            {#if identity}
                <div>{speaking ? "Speaking" : "Silence"}</div>
                <button class="disconnect" disabled={(identity == null || token == null)} on:click={() => disconnect()}
                    >Disconnect</button
                >
                <pre class="user-name">{identity}</pre>
            {:else}
                <p class="user-name">No Identity</p>
            {/if}
        </div>
    </div>

    <div class="content">
        <div class="head">
            <div class="channel-title" />
            <div class="actions" />
        </div>
        <div class="body">
            <div class="message-pane" />
            <div class="sidebar">
                <div class="user-list" />
            </div>
        </div>
    </div>
</main>

<style>
    main {
        display: flex;
        height: 100vh;
        width: 100vw;
    }

    .server-list {
        width: 72px;
        background-color: var(--bg-3);
    }
    .sidebar {
        width: 240px;
        background-color: var(--bg-1);
        display: flex;
        flex-direction: column;
    }
    .server-head {
        height: 48px;
        background-color: var(--bg-1);
        box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

        box-sizing: border-box;
        padding: 12px 16px;

        display: flex;
        align-items: center;
    }
    .content {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }
    .head {
        height: 48px;
        background-color: var(--bg-1);
        box-shadow: 0px 2px 3px 0 rgba(0, 0, 0, 0.3);
        z-index: 100;
        background-color: var(--bg-0);
    }
    .body {
        flex-grow: 1;
        display: flex;
        height: 100px;
    }
    .message-pane {
        flex-grow: 1;
        background-color: var(--bg-0);
    }
    .server-channels {
        padding: 8px 12px;
        flex-grow: 1;
    }
    .user-controls {
        min-height: 64px;
        background-color: var(--bg-1);
        box-shadow: 2px -2px 3px 0 rgba(0, 0, 0, 0.2);

        box-sizing: border-box;
        padding: 12px 16px;

        display: flex;
        justify-content: center;
        flex-direction: column;
    }
    .disconnect {
        margin-top: 8px;
        padding: 10px 20px;
        font-family: inherit;
        font-weight: 600;
        color: inherit;
        background-color: #c94b44;
        border: none;
        border-radius: 6px;
        cursor: pointer;
    }
</style>
