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