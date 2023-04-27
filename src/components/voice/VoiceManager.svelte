<script lang="ts">
    import type {
        Consumer,
        Producer,
        Transport,
    } from "mediasoup-client/lib/types";

    import { Device } from "mediasoup-client";
    import {
        auth_fetch,
        json_fetch,
        VoiceState,
        type Peer,
        type VoiceChannelInfo,
    } from "../../lib/voice";

    import {
        voiceChannelTarget,
        voiceChannelCurrent as currentChannelStore,
        voicePeers as voicePeersStore,
        voiceState,
        voiceChannelCurrent,
    } from "../../lib/stores";

    let device: Device = null;

    export let identity: string = null;
    let token: string = null;

    let socket: WebSocket = null;
    let heartbeat_handle: number = null;

    let send_transport: Transport = null;
    export let producer: Producer = null;

    let recv_transport: Transport = null;
    let voicePeers: Map<string, Peer> = new Map();

    let currentChannel: VoiceChannelInfo = null;

    // list of peers
    $: current_peers = [...voicePeers.values()];
    // every consumer ever
    $: all_consumers = current_peers.flatMap((peer) => [
        ...peer.consumers.values(),
    ]);
    // update stores based on local state
    // it is crucial that this is done like this, otherwise the stores will not update sometimes
    // also, we don't want the outside to be able to mess up the voicemanager state!
    $: voicePeersStore.set(voicePeers);
    $: currentChannelStore.set(currentChannel);

    // whenever voiceChannelTarget changes, we need to join, leave or switch to a channel
    voiceChannelTarget.subscribe(async (target) => {
        // ignore undefined, it represents "no change"
        if (target === undefined) return;

        // if we are already connected, disconnect
        if ($voiceState != VoiceState.DISCONNECTED) {
            await disconnect();
        }

        // if the target is null, we are disconnecting for good
        // we've already called disconnect(), so the work is done!
        if (target === null) {
            currentChannel = null;
            return;
        }

        // otherwise, we are joining a channel and need to connect
        currentChannel = target;
        // reset the target to a "no change" state
        $voiceChannelTarget = undefined;
        // do the connection
        await join(target.id);
    });

    /**
     * Start the connection process to a voice channel
     * @param channel_id The channel to connect to
     */
    async function join(channel_id: string) {
        if ($voiceState != VoiceState.DISCONNECTED) return;

        try {
            voiceState.set(VoiceState.GETTING_IDENTITY);

            let data = await json_fetch(`/api/voice/join?c=${channel_id}`);
            identity = data.identity;
            token = data.token;

            // create websocket url
            // wss or ws depending on secure
            let ws_url = new URL(
                `ws${location.protocol === "https:" ? "s" : ""}://${
                    location.host
                }/api/voice/ws/`,
                location.href
            );
            ws_url.searchParams.set("i", identity);
            ws_url.searchParams.set("t", token);

            // connect to websocket
            socket = new WebSocket(ws_url);

            // the moment the socket opens, begin the initialization process
            socket.onopen = async () => {
                await start_connection(data.rtp);
            };

            // whenever the socket closes, we need to disconnect
            socket.onclose = async () => {
                if (
                    $voiceState != VoiceState.DISCONNECTING &&
                    $voiceState != VoiceState.DISCONNECTED
                ) {
                    await disconnect();
                }
            };

            // server events
            socket.onmessage = async (e) => {
                let data = JSON.parse(e.data);
                await on_server_event(data);
            };

            // in browsers, websockets disconnect after 30 seconds of inactivity
            // which means we need to send a message periodically to keep the connection alive
            heartbeat_handle = setInterval(
                () => socket.send("heartbeat"),
                5000
            );
        } catch (error) {
            // something went wrong, in the identity getting or socket construction???
            console.error(error);
            await reset();
        }
    }

    /**
     * Resets the voice manager to a disconnected state, clearning all the variables,
     * closing all the transports and consumers, socket connetion, etc.
     *
     * DOES NOT NOTIFY THE SERVER OF DISCONNECTION!
     * Use disconnect() for that, which calls reset() internally.
     */
    async function reset() {
        identity = null;
        token = null;
        $voiceState = VoiceState.DISCONNECTING;

        if (heartbeat_handle != null) {
            clearInterval(heartbeat_handle);
            heartbeat_handle = null;
        }

        if (socket) {
            socket.onclose = undefined;
            socket.close();
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

        for (let peer of voicePeers.values()) {
            remove_peer(peer);
        }
        // for some reason voicePeers is not being reset

        voicePeers = new Map();
        voicePeers = voicePeers;
        voiceState.set(VoiceState.DISCONNECTED);

        $voiceChannelCurrent = null;

        device = null;
    }

    /**
     * Gracefully disconnects from the voice server, notifying the server of the disconnection.
     *
     * Calls reset() internally.
     */
    async function disconnect() {
        if (!identity || !token) return;
        $voiceState = VoiceState.DISCONNECTING;

        try {
            await auth_fetch(identity, token, `/api/voice/leave`, null, false);
        } catch (e) {
            console.error("graceful disconnect failed,", e);
        }

        await reset();
    }

    /**
     * Starts the connection process, creating the mediasoup device, and the send and receive transports.
     *
     * @param rtp_capabilities The RTP capabilities of the server
     */
    async function start_connection(routerRtpCapabilities) {
        voiceState.set(VoiceState.PERMISSION_REQUEST);

        // get all the tracks
        let local_stream;
        try {
            local_stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false,
            });
        } catch (e) {
            console.error(
                "Permission to audio/video devices denied, disconnecting..."
            );
            alert(
                "You must allow access to your microphone to use voice chat! Make sure you haven't denied access to your microphone in your browser settings."
            );
            await reset();
            return;
        }
        const audio_track = local_stream.getAudioTracks()[0];

        voiceState.set(VoiceState.CONNECTING);

        // load mediasoup devices
        device = new Device();
        await device.load({ routerRtpCapabilities });

        // set up transports
        await initialize_send_transport();
        await initialize_recv_transport();

        // start producer
        producer = await send_transport.produce({ track: audio_track });

        // add self to voice peers
        await add_peer(identity, true, producer);

        let already_in_vc = await auth_fetch(
            identity,
            token,
            "/api/voice/peers"
        );

        // consume existing
        for (const peer of already_in_vc) {
            await add_peer(peer.identity);
            for (const producerId of peer.producers) {
                await consume(peer.identity, producerId);
            }
        }
    }

    /**
     * Creates a send transport with the server, and wires up its events.
     * After this, `send_transport` should be populated.
     */
    async function initialize_send_transport() {
        // voice_status = "ST Creating..."; // ST = Send Transport
        send_transport = device.createSendTransport(
            await auth_fetch(
                identity,
                token,
                `/api/voice/transport/create?type=send`,
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
                        `/api/voice/transport/connect?type=send`,
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
                        `/api/voice/produce`,
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

    /**
     * Sets up the receive transport and hooks events.
     */
    async function initialize_recv_transport() {
        recv_transport = device.createRecvTransport(
            await auth_fetch(
                identity,
                token,
                `/api/voice/transport/create?type=recv`,
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
                        `/api/voice/transport/connect?type=recv`,
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

    /**
     * Hooks events from the server, and handles them.
     */
    async function on_server_event(data: any) {
        switch (data.type) {
            // server told us about a new peer
            case "client_connected":
                if (data.identity == identity) {
                    console.warn(
                        'Received "client_connected" for self, ignoring...'
                    );
                    return;
                }
                await add_peer(data.identity);
                break;
            case "client_disconnected":
                if (data.identity == identity) {
                    // are you trying to tell me something?
                    console.warn(
                        'Received "client_disconnected" for self, ignoring...'
                    );
                    return;
                }
                await remove_peer(data.identity);
                break;
            case "new_producer":
                console.log("New producer, starting consume...", data);
                // peer published a new producer, time to start consooming
                await consume(data.identity, data.producer_id);
                break;
        }
    }

    /**
     * Adds a `Peer` to the voicePeers map, and signals reactivity (voicePeers = voicePeers).
     *
     * If this is the local peer:
     * - The `local_track` should be provided so that it can be used to show the local speaking status in the UI.
     *   Not setting it is not fatal, but it will make the UI not show the local speaking status.
     * - `is_me` shoulb be set to true.
     *
     * @param identity The peer's identity
     * @param is_me Set to true if this is the local peer
     * @param local_track The local track to use for the local speaking status
     */
    async function add_peer(identity, is_me?, producer?: Producer) {
        if (voicePeers.has(identity)) return false;

        voicePeers.set(identity, {
            is_me: is_me === true,
            identity,
            consumers: new Map(),
            producer,
        });
        voicePeers = voicePeers;

        return true;
    }

    /**
     * Removes a `Peer` from the voicePeers map, and signals reactivity (voicePeers = voicePeers).
     * @param identity The peer's identity
     */
    async function remove_peer(identity) {
        let peer = voicePeers.get(identity);
        if (peer == null) return false;

        for (let consumer of peer.consumers.values()) {
            await consumer.close();
        }

        voicePeers.delete(identity);
        voicePeers = voicePeers;

        return true;
    }

    /**
     * Consumes a producer from a peer. Updates the voicePeers map, and signals reactivity (voicePeers = voicePeers).
     *
     * @param peerIdentity The peer's identity
     * @param producerId The producer's ID
     */
    async function consume(peerIdentity: string, producerId: string) {
        let peer = voicePeers.get(peerIdentity);
        if (peer === undefined) return;

        let consumer = await recv_transport.consume(
            await auth_fetch(identity, token, "/api/voice/consume", {
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
        voicePeers = voicePeers;
    }

    /**
     * Useful hook for Svelte to update the audio element's srcObject.
     */
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

{#if all_consumers.length > 0}
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
{/if}
