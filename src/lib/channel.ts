import type { Dayjs } from "dayjs";
import type { UploadedFile, PendingUpload } from "src/lib/upload";

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

export interface DmChannel extends TextChannel {
    type: "text";
    friend: PublicUserInfo;
    // todo: set permissions to be a type that only allows read
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
