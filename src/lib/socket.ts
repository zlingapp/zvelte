import type { Unsubscriber } from "svelte/store";
import { eventSocket } from "src/lib/stores";
import type { Message, PublicUserInfo } from "src/lib/channel";

export interface EventSocketMessage {
    topic: {
        type: string;
        id: string;
    };
    event: Event;
}

export type Event =
    | {
          type: "channelListUpdate";
      }
    | {
          type: "memberListUpdate";
      }
    | ({
          type: "message";
      } & Message)
    | {
          type: "deleteMessage";
          id: string;
      }
    | {
          type: "typing";
          user: PublicUserInfo;
      }
    | {
          type: "friendRequestUpdate";
          state: "sent" | "accepted";
          user: PublicUserInfo;
      }
    | {
          type: "friendRequestRemove";
          user: PublicUserInfo;
      }
    | {
          type: "friendRemove";
          user: PublicUserInfo;
      };

export type TopicType = "channel" | "dm_channel" | "guild" | "user";
export interface Topic {
    type: TopicType;
    id: string;
}

// send something on the event socket
export async function eventSocketSend(data: string) {
    const socket = await waitForEventSocket();
    socket.send(data);
}

// function to wait for the socket to be connected
async function waitForEventSocket(): Promise<WebSocket> {
    // wait for the socket to exist first
    let unsubscriber: Unsubscriber = () => {};
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

export async function eventSocketSubscribe(topics: Topic[]) {
    await eventSocketSend(JSON.stringify({ type: "sub", topics }));
}

export async function eventSocketUnsubscribe(topics: Topic[]) {
    await eventSocketSend(JSON.stringify({ type: "unsub", topics }));
}
