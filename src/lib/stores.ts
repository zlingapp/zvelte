import { writable } from 'svelte/store';
import type { LocalUser, Tokens } from './auth';
import type { Channel, DMChannel, PublicUserInfo, TextChannel } from './channel';
import type { Guild } from './guild';
import { localStorageWritable } from './localStorageStore';
import { VoiceState, type Peer, type VoiceChannelInfo } from './voice';
import type { Theme } from './theme';
import {defaultTheme} from './theme';
import type { UnreadDM } from './friends';

// ---- login stuff ---
export const apiTokens = localStorageWritable<Tokens>("api_token", null);
export const localUser = writable<LocalUser>(null);

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
export const voiceChannelTarget = writable<VoiceChannelInfo | null>(null);

export const voiceChannelCurrent = writable<VoiceChannelInfo | null>(null);

export const voicePeers = writable<Map<string, Peer>>(new Map());

// ---- misc ----

export const eventSocket = writable<WebSocket | null>(null);

// event for when the user clicks a context menu
export const contextMenu = writable(null);

// string to show in an error modal
export const showInErrorModal = writable(null);

export const userSettingsOpen = writable(false);

// list of themes to show in the theme editor
export const themes = localStorageWritable<Array<Theme>>("themes",[]);

// should the theme editor be open and if so what theme id is it editing
export const editingThemeId = writable<Theme["id"]>(null);

export const dmChannelOpen = writable<DMChannel | null>(null);

// map of unread DMs by friend id
export const unreadDMs = localStorageWritable<Record<string, UnreadDM>>("unread_dms", {});

export const recentDMs = localStorageWritable<PublicUserInfo[]>("recent_dms", []);