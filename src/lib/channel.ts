import type { Dayjs } from "dayjs";
import type { UploadedFile } from "./upload";
import type { PendingUpload } from "../components/text/MessageAttachButton.svelte";

export interface Channel {
    id: string;
    name: string;
    type: "text" | "voice";
    permissions: ChannelPermissions;
}

export interface ChannelPermissions {}

export interface TextChannel extends Channel {
    type: "text";
}

export interface Message {
    id: string;
    createdAt: Dayjs;
    content?: string;
    attachments?: (UploadedFile | PendingUpload)[];
    author: PublicUserInfo;
}

export interface PublicUserInfo {
    id: string;
    avatar: string;
    username: string;
}