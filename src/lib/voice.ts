import type { Consumer, Producer } from "mediasoup-client/lib/types";
import { voiceChannelTarget } from "./stores";

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

export async function json_fetch(url, init?: RequestInit) {
    const response = await fetch(url, init);
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return response.json();
}

export async function auth_fetch(identity, token, url, init?: RequestInit, expect_json?: boolean) {
    if (init == null) {
        init = {}
    }
    
    init.headers = {
        ...init.headers,
        "RTC-Identity": identity,
        "RTC-Token": token,
    }

    const response = await fetch(url, init);
    if (!response.ok) {
        throw new Error(response.statusText);
    }

    if (expect_json === false) {
        return response.text;
    } else {
        return response.json();
    }
}

export function disconnectFromVoice() {
    voiceChannelTarget.update((v) => null);
}