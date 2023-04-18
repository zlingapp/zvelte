import { writable } from 'svelte/store';
import { VoiceState } from '../lib/voice';
import { mapStore } from './map_store';

export const voiceState = writable(VoiceState.DISCONNECTED);

// update this to trigger a voice connection
export const voiceChannelId = writable<string>(null);

export const voicePeers = mapStore()