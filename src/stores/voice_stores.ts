import { writable } from 'svelte/store';
import { VoiceState, type Peer, type VoiceChannelInfo } from '../lib/voice';

export const voiceState = writable(VoiceState.DISCONNECTED);

// update this to trigger a voice connection
// null means disconnect
// undefined means no need for change
// anything else means connect to that channel
export const voiceChannelTarget = writable<VoiceChannelInfo>(null);

export const voiceChannelCurrent = writable<VoiceChannelInfo>(null);

export const voicePeers = writable<Map<string, Peer>>(new Map());