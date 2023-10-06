import type { Consumer, Producer } from "mediasoup-client/lib/types";
import { get } from "svelte/store";
import { authFetch } from "./auth";
import { voiceChannelTarget, voicePeers } from "./stores";

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
    user: {
        id: string;
        username: string;
        avatar: string;
    }
    consumers: Map<string, Consumer>;
    is_me: boolean;
    producer: Producer; // used only for the local peer
}

export interface VoiceChannelInfo {
    guild_name: string;
    name: string;
    id: string;
}

export async function voiceAuthFetch(identity, token, url, init?: RequestInit, expect_json?: boolean) {
    if (init == null) {
        init = {}
    }
    
    init.headers = {
        ...init.headers,
        "RTC-Identity": identity,
        "RTC-Token": token,
    }

    const response = await authFetch(url, init);
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

// if there is more than one peer with the same user id, in the same voice channel
// then that user is connected to the voice channel from multiple devices
export function isPeerDuplicate(peer: Peer) {
    let count = 0;
    
    get(voicePeers).forEach((p) => {
        if (p.user.id === peer.user.id) {
            count++;
        }
    });

    return count > 1;
}