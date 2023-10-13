<script lang="ts">
    import { onMount } from "svelte";
    import { currentInstance, ensureHaveValidTokens } from "../lib/auth";
    import { eventSocketSend } from "../lib/socket";
    import { apiTokens, eventSocket } from "../lib/stores";

    export let socketDisconnected = true;
    let socketReconnectAttempt = 0;

    async function connectWebSocket() {
        if ($eventSocket && $eventSocket?.readyState !== WebSocket.CLOSED) {
            return;
        }

        if ($apiTokens == null) {
            return;
        }

        let tokens = await ensureHaveValidTokens();
        if (tokens == null) {
            // the above function will have already redirected us to the login page
            return;
        }

        let ws_url = new URL(
            $currentInstance.url.toString().replaceAll("http", "ws") + `/events/ws/`
        );
        ws_url.searchParams.append("auth", tokens.accessToken);

        console.log('Connecting event socket...')
        const socket = new WebSocket(ws_url);

        socket.onopen = async () => {
            console.info('Event socket connected!');
            socketDisconnected = false;
            socketReconnectAttempt = 0;
        };

        socket.onclose = async () => {
            socketReconnectAttempt += 1;
            const socketReconnectBackOff = Math.min(+Math.floor(Math.pow(10, 0.5 * socketReconnectAttempt + 2)).toPrecision(1), 60000);

            console.warn(`Event socket closed! Reconnecting in ${socketReconnectBackOff}ms...`);
            socketDisconnected = true;
            clearInterval(heartbeat_handle);

            // wait SocketReconnectBackOff ms before reconnecting
            await new Promise((resolve) => setTimeout(resolve, socketReconnectBackOff));
            connectWebSocket();
        };

        $eventSocket = socket;

        // in browsers, websockets disconnect after 30 seconds of inactivity
        // which means we need to send a message periodically to keep the connection alive
        let heartbeat_handle = setInterval(
            () => eventSocketSend("heartbeat"),
            15000
        );
    }

    onMount(async () => {
        connectWebSocket();

        window.addEventListener("focus", () => {
            connectWebSocket();
        });
    });
</script>