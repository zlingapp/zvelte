<script lang="ts">
    import type { TextChannel } from "../lib/channel";
    import MajesticonsHashtagLine from "~icons/majesticons/hashtag-line";
    import MessageCaret from "./text/MessageCaret.svelte";
    import { eventSocket } from "../lib/stores";
    import { afterUpdate, onDestroy, onMount } from "svelte";
    import Message from "./text/Message.svelte";
    import { auth_fetch } from "../lib/auth";
    import { eventSocketSend } from "../lib/socket";
    import TopicConsumer from "./TopicConsumer.svelte";

    export let guild_id: string;
    export let channel: TextChannel;
    let channelOld: TextChannel;

    let messages = [];
    let messagesList: HTMLDivElement;

    async function fetchMessageHistory() {
        let channel_id = channel?.id;
        if (channel_id == null) {
            console.warn(
                "channel_id of",
                channel,
                "was null, cannot get history"
            );
            return;
        }

        let resp = await auth_fetch(
            `/api/guilds/${guild_id}/channels/${channel_id}/messages`
        );
        messages = await resp.json();
    }

    afterUpdate(() => {
        if (messagesList && messagesList.children.length > 0)
            messagesList.scrollTo(0, messagesList.scrollHeight);
    });

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
            messages = [];
            // get message history
            fetchMessageHistory();
            // subscribe to new channel, unsubscribe from old channel
            resubscribeToTopics();
        }
    }
</script>

<TopicConsumer
    onReconnect={() => {
        fetchMessageHistory();
        resubscribeToTopics();
    }}
    eventFilter={(msg) =>
        msg.topic.type === "channel" && msg.topic.id === channel?.id}
    onRelevantEvent={(msg) => {
        if (msg.event.type === "message") {
            messages = [...messages, msg.event];
        }
    }}
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
            <div class="messages" bind:this={messagesList}>
                {#each messages as msg, idx}
                    <Message
                        message={msg}
                        detailed={messages[idx - 1]?.author.id != msg.author.id}
                    />
                {/each}
            </div>
            <MessageCaret />
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
</style>
