import type { Channel } from "./channel";

export interface Guild {
    id: string,
    name: string,
    channels?: Channel[],
    members?: Member[],
    me?: Member,
    icon: string,
}

export interface Member {
    id: string,
    username: string,
    discrim: string,
    avatar: string,
    status: MemberStatus
}

export enum MemberStatus {
    ONLINE, OFFLINE, IDLE, DND
}
