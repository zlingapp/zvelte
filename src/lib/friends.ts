import type { PublicUserInfo } from "./channel";

export interface FriendRequest {
    direction: "incoming" | "outgoing";
    user: PublicUserInfo;
}