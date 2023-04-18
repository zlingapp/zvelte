import type { Consumer } from "mediasoup-client/lib/types";

export enum VoiceState {
    PERMISSION_REQUEST,
    GETTING_IDENTITY,
    CONNECTING,
    CONNECTED,
    DISCONNECTED,
}

export interface Peer {
    is_me: Boolean;
    identity: String;
    consumers: Map<String, Consumer>;
}
