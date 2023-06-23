<script lang="ts">
    import dayjs, { Dayjs } from "dayjs";
    import { tick } from "svelte";
    import { fly } from "svelte/transition";
    import MajesticonsHashtagLine from "~icons/majesticons/hashtag-line";
    import SvgSpinners3DotsFade from "~icons/svg-spinners/3-dots-fade";
    import { auth_fetch } from "../../lib/auth";
    import type { Message, TextChannel } from "../../lib/channel";
    import { eventSocketSend, type EventSocketMessage } from "../../lib/socket";
    import { localUser } from "../../lib/stores";
    import TopicConsumer from "../TopicConsumer.svelte";
    import MessageCaret from "./MessageCaret.svelte";
    import UiMessage from "./UiMessage.svelte";

    export let guild_id: string;
    export let channel: TextChannel;
    let channelOld: TextChannel;

    let messages: Message[] = [];
    let messagesList: HTMLDivElement;

    let loadingOlder = false;
    let nothingOlder = false;
    let typing: Map<string, any> = new Map();

    let pendingOutgoingMessage: Message = null;

    const MESSAGE_FETCH_LIMIT = 50;
    const CONSIDER_TYPING_STOPPED_AFTER = 5000;

    async function fetchMessageHistory(
        before: Dayjs = null,
        after: Dayjs = null
    ) {
        let channel_id = channel?.id;
        if (channel_id == null) {
            console.warn(
                "channel_id of",
                channel,
                "was null, cannot get history"
            );
            return;
        }

        let url = `/api/guilds/${guild_id}/channels/${channel_id}/messages?limit=${MESSAGE_FETCH_LIMIT}`;

        if (before != null) {
            url += `&before=${before.toISOString()}`;
        }
        if (after != null) {
            url += `&after=${after.toISOString()}`;
        }

        let resp = await auth_fetch(url);
        return ((await resp.json()) as Message[]).map(parseMessage);
    }

    function parseMessage(raw: Message): Message {
        return {
            ...raw,
            created_at: dayjs.utc(raw.created_at).tz(dayjs.tz.guess()),
        };
    }

    async function resubscribeToTopics() {
        // subscribe to new channel
        let msg: any = {
            sub: ["channel:" + channel?.id],
        };
        if (channelOld != null && channelOld.id !== channel.id) {
            // transitioning from one channel to another, so unsubscribe from the old one
            msg = { ...msg, unsub: ["channel:" + channelOld.id] };
        }

        await eventSocketSend(JSON.stringify(msg));
        channelOld = channel;
    }

    $: {
        // channel switch without remount
        if (channelOld?.id !== channel?.id) {
            nothingOlder = false;

            // clear old intervals
            for (const typer of typing.values()) {
                clearTimeout(typer.deleterHandle);
            }
            typing = new Map();

            // get message history
            initialFetch();
            // subscribe to new channel, unsubscribe from old channel
            resubscribeToTopics();
        }
    }

    function onRelevantEvent(esm: EventSocketMessage) {
        switch (esm.event.type) {
            case "message":
                const message = parseMessage(esm.event as unknown as Message);

                if (message.author.id == $localUser.id) {
                    // TODO: make a better system for this with a ref value
                    pendingOutgoingMessage = null;
                }

                messages = [...messages, message];

                const typer = typing.get(esm.event.author.id);
                if (typer) {
                    clearTimeout(typer.deleterHandle);
                    typing.delete(esm.event.author.id);
                    typing = typing;
                }

                scrollToBottom();
                break;
            case "typing":
                if (esm.event.user.id === $localUser.id) return;

                const existing = typing.get(esm.event.user.id);
                if (existing) {
                    clearTimeout(existing.deleterHandle);
                }

                typing.set(esm.event.user.id, {
                    ...esm.event.user,
                    lastTyping: Date.now(),
                    deleterHandle: setTimeout(() => {
                        typing.delete(esm.event.user.id);
                        typing = typing;
                    }, CONSIDER_TYPING_STOPPED_AFTER),
                });

                typing = typing;
            default:
                break;
        }
    }

    function shouldSeparateMessage(last: Message, current: Message) {
        if (last == null) return true;
        if (last.author.id !== current.author.id) return true;
        if (
            !last.created_at
                .endOf("day")
                .isSame(current.created_at.endOf("day"))
        )
            return true;
        if (current.created_at.diff(last.created_at, "hours") >= 1) return true;
        return false;
    }

    async function scrollToBottom() {
        await tick();
        if (messagesList) messagesList.scrollTo(0, messagesList.scrollHeight);
    }

    async function initialFetch() {
        // reset pending message since we're doing a reset from the beginning
        pendingOutgoingMessage = null;

        let result = await fetchMessageHistory();
        if (result.length < MESSAGE_FETCH_LIMIT) {
            nothingOlder = true;
        }
        messages = result;
        scrollToBottom();
    }

    async function onMessagesScroll() {
        if (messagesList.scrollTop === 0 && !loadingOlder && !nothingOlder) {
            loadingOlder = true;

            let messagesBefore = await fetchMessageHistory(
                messages[0]?.created_at
            );

            if (messagesBefore.length > 0) {
                messages = [...messagesBefore, ...messages];
            }

            if (messagesBefore.length < MESSAGE_FETCH_LIMIT) {
                nothingOlder = true;
            }

            loadingOlder = false;
        }
    }
</script>

<TopicConsumer
    onReconnect={async () => {
        initialFetch();
        resubscribeToTopics();
    }}
    eventFilter={(msg) =>
        msg.topic.type === "channel" && msg.topic.id === channel?.id}
    {onRelevantEvent}
/>

<div class="channel-content">
    <div class="head">
        <span class="icon">
            <MajesticonsHashtagLine />
        </span>
        <div class="channel-title">
            {channel.name}
        </div>
        <div class="actions" />
    </div>
    <div class="body">
        <div class="middle-pane">
            <div
                class="messages"
                bind:this={messagesList}
                on:scroll={onMessagesScroll}
            >
                {#if nothingOlder}
                    <div class="beginning">
                        <div>Beware! Here begins the history of...</div>
                        <div
                            style="display:flex; align-items: center; gap: 5px; font-size: 32px;"
                        >
                            <MajesticonsHashtagLine color="var(--text-color)" />
                            <span style="color: var(--text-color); font-weight: 600;">{channel.name}</span>
                        </div>
                    </div>
                    <div class="separator" />
                {/if}
                {#if loadingOlder}
                    <div class="loading">Loading older messages...</div>
                {/if}
                {#each messages as message, idx}
                    <!-- {"" + message.created_at.diff(messages[idx - 1]?.created_at, "hours")} -->
                    <UiMessage
                        {message}
                        detailed={shouldSeparateMessage(
                            messages[idx - 1],
                            message
                        )}
                    />
                {/each}
                {#if pendingOutgoingMessage}
                    <UiMessage
                        pending
                        message={pendingOutgoingMessage}
                        detailed={shouldSeparateMessage(
                            messages[messages.length - 1],
                            pendingOutgoingMessage
                        )}
                    />
                {/if}
            </div>
            <MessageCaret
                onOutgoingMessage={(msg) => {
                    pendingOutgoingMessage = msg;
                }}
            />
            {#if typing.size > 0}
                <div
                    class="typing-list"
                    transition:fly={{ y: 10, duration: 100 }}
                >
                    <div class="typing-icon">
                        <SvgSpinners3DotsFade />
                    </div>
                    {#if typing.size >= 5}
                        <span class="typer" style="margin-right: 12px;"
                            >Several people are typing...</span
                        >
                        {#each [...typing.values()] as typer}
                            <!-- svelte-ignore a11y-missing-attribute -->
                            <img
                                class="typer-avatar overlap-avatar"
                                src={typer.avatar}
                                height="14px"
                            />
                        {/each}
                    {:else}
                        {#each [...typing.values()] as typer, idx}
                            <!-- svelte-ignore a11y-missing-attribute -->
                            <img
                                class="typer-avatar"
                                src={typer.avatar}
                                height="14px"
                            />
                            <span class="typer">
                                {typer.username.split("#")[0]}
                            </span>
                            {#if idx < typing.size - 1}
                                {#if idx < typing.size - 2}
                                    <span style="margin-right: 4px;">,</span>
                                {:else}
                                    <span style="margin-inline: 4px;">and</span>
                                {/if}
                            {/if}
                        {/each}
                        <span class="typing-suffix">is typing...</span>
                    {/if}
                </div>
            {/if}
        </div>
        <slot name="sidebar" />
    </div>
</div>

<style>
    .channel-content {
        flex-grow: 1;
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .head {
        height: 48px;
        display: flex;
        align-items: center;

        background-color: var(--bg-0);
        box-shadow: 0px 2px 3px 0 rgba(0, 0, 0, 0.3);
        z-index: 1;

        padding-left: 12px;
        gap: 6px;
    }

    .icon {
        line-height: 0;
        color: var(--gray);
    }

    .channel-title {
        font-weight: 600;
    }

    .body {
        flex-grow: 1;
        display: flex;
        /* I have no clue why this fixes the y-overflow issue, but it does */
        /* In fact, at runtime, the body element expands to 927px, isn't that crazy?  */
        height: 0;
    }
    .middle-pane {
        flex-grow: 1;
        background-color: var(--bg-0);
        display: flex;
        flex-direction: column;
        position: relative;
    }

    .messages {
        flex-grow: 1;
        overflow-y: auto;
        box-sizing: border-box;
        padding-block-end: 20px;
    }

    .messages::-webkit-scrollbar {
        width: 16px;
        height: 16px;
    }

    .messages::-webkit-scrollbar-thumb {
        background-color: var(--bg-2);
        border: 4px solid var(--bg-0);
        border-radius: 8px;
    }

    .typing-list {
        position: absolute;
        bottom: 0;
        left: 19px;
        display: flex;
        align-items: center;
        font-size: 14px;
        user-select: none;
    }

    .typing-icon {
        line-height: 0;
        font-size: 20px;
        margin-right: 8px;
    }

    .typer-avatar {
        border-radius: 50%;
        margin-right: 4px;
    }

    .typer {
        font-weight: 600;
    }

    .typing-suffix {
        margin-left: 4px;
    }

    .overlap-avatar {
        margin-left: -8px;
        box-sizing: border-box;
        outline: 2px solid var(--bg-0);
    }

    .beginning {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--gray);
        
        font-size: 20px;
        
        margin: 16px;
        padding-top: 20px;
        padding-bottom: 24px;

        user-select: none;

        background-image: radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px);
        background-size: 20px 20px;
    }

    .separator {
        border-top: 3px dashed rgba(255, 255, 255, 0.1);
        width: 100%;
        margin-bottom: 24px;
    }
</style>
