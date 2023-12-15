import type { PublicUserInfo } from "src/lib/channel";
import { currentGuildChannel, currentGuild, currentDmChannel, recentDms, unreadDms } from "src/lib/stores";

export interface FriendRequest {
    direction: "incoming" | "outgoing";
    user: PublicUserInfo;
}

export interface UnreadDM {
    user: PublicUserInfo;
    count: number;
}

/// transition into a DM channel with a friend
export function openDmWith(friend: PublicUserInfo) {
    currentGuild.set(null);
    currentGuildChannel.set(null);
    currentDmChannel.set({
        id: friend.id,
        friend: friend,
        type: "text",
        name: friend.username.split("#")[0],
        permissions: {},
    });

    recentDms.update((arr: PublicUserInfo[]) => {
        // add to the top of the list if not already there
        const index = arr.findIndex((u) => u.id === friend.id);
        if (index == -1) {
            arr.unshift(friend);
        }
        return arr;
    });

    markDmRead(friend.id);
}

export function markDmRead(id: string) {
    unreadDms.update((obj: Record<string, UnreadDM>) => {
        delete obj[id];
        return obj;
    })
}