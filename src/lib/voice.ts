import type { Consumer, Producer } from "mediasoup-client/lib/types";

export enum VoiceState {
    PERMISSION_REQUEST,
    GETTING_IDENTITY,
    CONNECTING,
    CONNECTED,
    DISCONNECTING,
    DISCONNECTED,
}

export interface Peer {
    identity: string;
    consumers: Map<string, Consumer>;
    is_me: Boolean;
    producer: Producer; // used only for the local peer
}

export interface VoiceChannelInfo {
    name: string;
    id: string;
}