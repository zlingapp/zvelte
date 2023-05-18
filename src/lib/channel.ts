import type { Dayjs } from "dayjs"

export interface Channel {
    id: string,
    name: string,
    type: "text" | "voice",
    permissions: ChannelPermissions
}

export interface ChannelPermissions {

}

export interface TextChannel extends Channel {
    type: "text"
}

export interface Message {
    id: string
    content: string,
    created_at: Dayjs,
    author: {
        id: string,
        avatar: string,
        nickname?: string,
        username: string
    },
}