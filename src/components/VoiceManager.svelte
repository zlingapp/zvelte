<script lang="ts">
    import type {
        Consumer,
        Producer,
        Transport,
    } from "mediasoup-client/lib/types";
    import { auth_fetch, json_fetch } from "../lib/voice_api";

    import { Device } from "mediasoup-client";
    import { VoiceState, type Peer } from "../lib/voice";
    import {
        voiceChannelId,
        voicePeers,
        voiceState,
    } from "../stores/voice_stores";
    import { tick } from "svelte";

    let device: Device = null;

    export let identity: string = null;
    let token: string = null;

    let socket: WebSocket = null;
    let heartbeat_handle: number = null;

    let send_transport: Transport = null;
    export let producer: Producer = null;

    let recv_transport: Transport = null;

    $: current_peers = [...$voicePeers.values()];
    $: all_consumers = current_peers.flatMap((peer) => [
        ...peer.consumers.values(),
    ]);

    voiceChannelId.subscribe(async (v) => {
        if ($voiceState != VoiceState.DISCONNECTED) {
            disconnect();
            return;
        }

        if (v == null) return;

        await join(v);
    });

    async function join(channel_id: string) {
        if ($voiceState != VoiceState.DISCONNECTED) return;

        try {
            voiceState.set(VoiceState.GETTING_IDENTITY);

            let data = await json_fetch(`/api/join?c=${channel_id}`);
            identity = data.identity;
            token = data.token;

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
        } catch (error) {
            console.error(error);
            await reset();
        }
    }

    async function reset() {
        identity = null;
        token = null;

        if (heartbeat_handle != null) {
            clearInterval(heartbeat_handle);
            heartbeat_handle = null;
        }

        if (socket) {
            await socket.close();
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

        for (let peer of $voicePeers.values()) {
            remove_peer(peer);
        }
        device = null;

        voicePeers.clear();
        voiceState.set(VoiceState.DISCONNECTED);
    }

    async function disconnect() {
        if (!identity || !token) return;

        try {
            await auth_fetch(identity, token, `/api/leave`, null, false);
        } catch (e) {
            console.error("graceful disconnect failed,", e);
        }

        await reset();
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
                    voiceState.set(VoiceState.CONNECTED);
                    break;
                case "failed":
                    // state = "Outbound Failed";
                    await reset();
                    break;
                case "disconnected":
                    // voice_status = "Outbound Disconnected";
                    break;
                case "closed":
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
        voiceState.set(VoiceState.PERMISSION_REQUEST);

        // produce
        let local_stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
        });
        const audio_track = local_stream.getAudioTracks()[0];

        voiceState.set(VoiceState.CONNECTING);

        device = new Device();
        await device.load({ routerRtpCapabilities });

        // add self to list of peers
        await add_peer(identity);

        await initialize_send_transport();
        await initialize_recv_transport();

        // voice_status = "Starting producer...";
        producer = await send_transport.produce({ track: audio_track });

        let already_in_vc = await auth_fetch(identity, token, "/api/peers");

        // consume existing
        for (const peer of already_in_vc) {
            await add_peer(peer.identity);
            for (const producerId of peer.producers) {
                await consume(peer.identity, producerId);
            }
        }
    }

    async function add_peer(identity) {
        if ($voicePeers.has(identity)) return false;

        await tick();
        voicePeers.set(identity, {
            is_me: false,
            identity,
            consumers: new Map(),
        });
        await tick();

        return true;
    }

    async function remove_peer(identity) {
        let peer = $voicePeers.get(identity);
        if (peer == null) return false;

        for (let consumer of peer.consumers.values()) {
            await consumer.close();
        }

        return true;
    }

    async function on_server_event(data: any) {
        switch (data.type) {
            case "client_connected":
                await add_peer(data.identity);
                break;
            case "client_disconnected":
                await remove_peer(data.identity);
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
                    voiceState.set(VoiceState.CONNECTED);
                    break;
                case "failed":
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
        let peer = $voicePeers.get(peerIdentity);
        if (peer === undefined) return;

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

        if (peer.consumers.has(peerIdentity)) {
            console.warn("already have consumer for", peerIdentity);
        }

        peer.consumers.set(consumer.id, consumer);
        voicePeers.set(peerIdentity, peer); // tickle the map so it updates state everywhere
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

<div>
    {#each all_consumers as c}
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
