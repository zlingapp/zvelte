<script lang="ts">
    import type { EventSocketMessage } from "src/lib/socket";
    import { eventSocket } from "src/lib/stores";
    import { onDestroy, onMount } from "svelte";
    import type { Unsubscriber } from "svelte/store";

    // function to call when the socket is reconnected
    export let onReconnect: Function;

    // function to call when ANY message is received
    export let onAnyMessage: (msg: EventSocketMessage) => void = undefined as any;
    // function to decide if a message is relevant to this component
    export let eventFilter: (msg: EventSocketMessage) => boolean = undefined as any;
    // function to call when a relevant message is received
    export let onRelevantEvent: (msg: EventSocketMessage) => void = undefined as any;

    let socketStoreUnsubscribe: Unsubscriber;
    let firstTimeSocketSubscribe = false;

    onMount(() => {
        socketStoreUnsubscribe = eventSocket.subscribe((socket) => {
            if (socket == null) return;

            socket.addEventListener("message", async (event) => {
                let msg = JSON.parse(event.data);

                if (onAnyMessage) onAnyMessage(msg);

                if (eventFilter && !eventFilter(msg)) {
                    return;
                }

                if (onRelevantEvent) onRelevantEvent(msg);
            });

            if (!firstTimeSocketSubscribe) {
                // socket is just now being connected
                firstTimeSocketSubscribe = true;
                return;
            }

            // this will be called ONLY when the socket reconnects, not when it first connects
            if (onReconnect) onReconnect(socket);
        });
    });

    onDestroy(() => {
        socketStoreUnsubscribe();
    });
</script>
