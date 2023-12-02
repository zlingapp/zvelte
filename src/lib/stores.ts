import { writable } from 'svelte/store';
import type { LocalUser, Tokens } from './auth';
import type { DMChannel, PublicUserInfo, TextChannel } from './channel';
import type { UnreadDM } from './friends';
import type { Guild } from './guild';
import { localStorageWritable } from './localStorageStore';
import type { Theme } from './theme';
import { VoiceState, type Peer, type VoiceChannelInfo } from './voice';

// ---- login stuff ---
export const apiTokens = localStorageWritable<Tokens  | null>("api_token", null);
export const localUser = writable<LocalUser | null>(null);

// --- guild state ---
export const guilds = writable<Guild[]>([]);
export const currentGuild = writable<Guild | null>(null);
export const currentChannel = writable<TextChannel | null>(null);

// ---- voice ----

export const voiceState = writable(VoiceState.DISCONNECTED);

// update this to trigger a voice connection
// null means disconnect
// undefined means no need for change
// anything else means connect to that channel
export const voiceChannelTarget = writable<VoiceChannelInfo | null | undefined>(null);

export const voiceChannelCurrent = writable<VoiceChannelInfo | null>(null);

export const voicePeers = writable<Map<string, Peer>>(new Map());

// ---- misc ----

export const eventSocket = writable<WebSocket | null>(null);

// event for when the user clicks a context menu - NOTE: interior value means
// nothing, this is used as a signal to open/close the context menu
export const contextMenu = writable(false);

// string to show in an error modal
export const showInErrorModal = writable<string | null>(null);

export const userSettingsOpen = writable(false);

// list of themes to show in the theme editor
export const themes = localStorageWritable<Theme[]>("themes", []);

// should the theme editor be open and if so what theme id is it editing
export const editingThemeId = writable<Theme["id"] | null>(null);

export const dmChannelOpen = writable<DMChannel | null>(null);

// map of unread DMs by friend id
export const unreadDMs = localStorageWritable<Record<string, UnreadDM>>("unread_dms", {});

export const recentDMs = localStorageWritable<PublicUserInfo[]>("recent_dms", []);