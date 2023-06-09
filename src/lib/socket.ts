import type { Unsubscriber } from "svelte/store";
import { eventSocket } from "./stores";

export interface EventSocketMessage {
    topic: {
        type: string;
        id: string;
    };
    event: {
        type: string;
        [key: string]: any;
    };
}

// send something on the event socket
export async function eventSocketSend(data: string) {
    const socket = await waitForEventSocket();
    socket.send(data);
}

// function to wait for the socket to be connected
async function waitForEventSocket(): Promise<WebSocket> {
    // wait for the socket to exist first
    let unsubscriber: Unsubscriber;
    // subscribe to the event socket store and wait until it's not null
    const socket = await new Promise<WebSocket>((resolve, reject) => {
        unsubscriber = eventSocket.subscribe((socket) => {
            if (socket) resolve(socket);
        });
    });
    // cleanup the store subscription
    unsubscriber();

    if (socket.readyState === WebSocket.OPEN) {
        return socket;
    }

    // wait for the socket to be connected
    return new Promise<WebSocket>((resolve, reject) => {
        socket.addEventListener("open", () => resolve(socket), { once: true });
    });
}
