import { writable } from 'svelte/store';
import type { LocalUser } from './auth';
import type { Channel, TextChannel } from './channel';
import type { Guild } from './guild';
import { VoiceState, type Peer, type VoiceChannelInfo } from './voice';

// ---- login stuff ---
export const localUser = writable<LocalUser>(null);

// --- guild state ---

export const currentGuild = writable<Guild>(null);
export const currentChannel = writable<TextChannel>(null);

// ---- voice ----

export const voiceState = writable(VoiceState.DISCONNECTED);

// update this to trigger a voice connection
// null means disconnect
// undefined means no need for change
// anything else means connect to that channel
export const voiceChannelTarget = writable<VoiceChannelInfo>(null);

export const voiceChannelCurrent = writable<VoiceChannelInfo>(null);

export const voicePeers = writable<Map<string, Peer>>(new Map());

// ---- misc ----

export const eventSocket = writable<WebSocket>(null);