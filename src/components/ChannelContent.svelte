<script lang="ts">
    import type { TextChannel } from "../lib/channel";
    import MajesticonsHashtagLine from "~icons/majesticons/hashtag-line";
    import MessageCaret from "./text/MessageCaret.svelte";
    import { eventSocket } from "../lib/stores";
    import { afterUpdate, onMount } from "svelte";
    import Message from "./text/Message.svelte";
    import { auth_fetch } from "../lib/auth";

    export let guild_id: string;
    export let channel: TextChannel;
    let channelOld: TextChannel;

    let messages = [];
    let messagesList: HTMLDivElement;

    async function fetch_message_history() {
        let channel_id = channel?.id;
        if (channel_id == null) {
            console.warn('channel_id of', channel, 'was null, cannot get history');
            return;
        }

        let resp = await auth_fetch(`/api/guilds/${guild_id}/channels/${channel_id}/messages`);
        messages = await resp.json();
    }

    onMount(() => {
        eventSocket.subscribe((sock) => {
            sock.addEventListener("message", async (event) => {
                let msg = JSON.parse(event.data);

                if (
                    msg.topic.type !== "channel" &&
                    msg.topic.id !== channel?.id
                ) {
                    console.warn("ignoring uninteresting topic", msg);
                    return;
                }

                if (msg.event.type === "message") {
                    console.log("new message: ", msg.event);
                    messages = [...messages, msg.event];
                }
            });
        });
    });

    afterUpdate(() => {
        if (messagesList && messagesList.children.length > 0)
            messagesList.scrollTo(0, messagesList.scrollHeight);
    });

    $: {
        if (channelOld?.id !== channel?.id) {
            messages = [];
            // subscribe to new channel, unsubscribe from old channel
            let msg: any = {
                sub: ["channel:" + channel?.id],
            };
            if (channelOld != null) {
                msg = { ...msg, unsub: ["channel:" + channelOld.id] };
            }

            $eventSocket?.send(JSON.stringify(msg));
            channelOld = channel;

            // get message history
            fetch_message_history();
        }
    }
</script>

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
                    <Message message={msg} detailed={messages[idx - 1]?.author.id != msg.author.id} />
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
