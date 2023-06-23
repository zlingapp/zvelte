<script lang="ts">
    import { currentChannel, currentGuild, localUser } from "../../lib/stores";

    import dayjs from "dayjs";
    import { onMount } from "svelte";
    import FluentSend20Filled from "~icons/fluent/send-20-filled";
    import TwemojiGrinningFaceWithSmilingEyes from "~icons/twemoji/grinning-face-with-smiling-eyes";
    import { auth_fetch } from "../../lib/auth";
    import type { Message } from "../../lib/channel";
    import MessageAttachButton, {
        type PendingUpload,
    } from "./MessageAttachButton.svelte";
    import { humanFileSize } from "../../lib/util";
    import AttachmentUploadIndicator from "./AttachmentUploadIndicator.svelte";
    import { flip } from "svelte/animate";
    let value;
    let sendButton: HTMLDivElement;

    // bound to the MessageAttachButton component
    let uploadAllAttachments: () => Promise<void>;
    let pendingUploads: PendingUpload[];

    export let onOutgoingMessage: (msg: Message) => void = () => {};

    let typingLastSent = 0;
    const RESEND_TYPING_EVERY = 4000;

    onMount(() => {
        currentChannel.subscribe(() => {
            typingLastSent = 0;
        });
    });

    function onKeyUp(e: KeyboardEvent) {
        switch (e.key) {
            case "Enter":
                if (e.shiftKey) {
                    break;
                }
                sendButton.click();
                e.preventDefault();
                break;
            case "Backspace":
                break;
            default:
                if (e.ctrlKey || e.metaKey || (e.altKey && e.which == 8)) {
                    break;
                }
                if (
                    !(e.keyCode >= 48 && e.keyCode <= 57) &&
                    !(e.keyCode >= 65 && e.keyCode <= 90)
                ) {
                    break;
                }
                if (Date.now() - typingLastSent >= RESEND_TYPING_EVERY) {
                    sendTyping();
                    typingLastSent = Date.now();
                }
                break;
        }
    }

    async function sendTyping() {
        await auth_fetch(
            `/api/guilds/${$currentGuild.id}/channels/${$currentChannel.id}/typing`,
            {
                method: "POST",
            }
        );
    }

    async function send() {
        if (value == null || value == "") {
            return;
        }

        const valueCopy = value;
        value = "";

        onOutgoingMessage({
            // identifiable in case this bad boy somehow gets sent to the backend
            id: "zvelte-pending",
            content: valueCopy,
            author: {
                id: $localUser.id,
                avatar: $localUser.avatar,
                username: $localUser.name,
                // TODO: resolve nickname here, maybe through guild Member
            },
            created_at: dayjs(),
        });

        // do upload
        if (pendingUploads.length > 0) {
            await uploadAllAttachments();
        }

        await auth_fetch(
            `/api/guilds/${$currentGuild.id}/channels/${$currentChannel.id}/messages`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: valueCopy }),
            }
        );

        pendingUploads = [];
        value = "";
    }
</script>

<div class="message-caret-container">
    {#if pendingUploads?.length > 0}
        <div class="attachment-list">
            {#each pendingUploads as upload, index (upload.randomLocalId)}
                <div
                    animate:flip={{
                        duration: 300,
                    }}
                >
                    <AttachmentUploadIndicator
                        {upload}
                        onRemove={() => {
                            // remove from pending uploads
                            pendingUploads.splice(index, 1);
                            pendingUploads = pendingUploads;
                        }}
                    />
                </div>
            {/each}
        </div>
    {/if}
    <div
        class="message-caret"
        class:pendingUploads={pendingUploads?.length > 0}
    >
        <MessageAttachButton
            bind:uploadAll={uploadAllAttachments}
            bind:pendingUploads
        />
        <input
            on:keyup={onKeyUp}
            bind:value
            class="input"
            placeholder="Message #{$currentChannel.name}"
        />
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
            class="icon"
            style="padding-inline: 8px;"
            bind:this={sendButton}
            on:click={() => send()}
        >
            <FluentSend20Filled style="font-size: 20px;" />
        </div>
        <div class="icon" style="padding-left: 8px;">
            <TwemojiGrinningFaceWithSmilingEyes
                style="font-size: 18px; filter: grayscale(100%);"
            />
        </div>
    </div>
</div>

<style>
    input {
        border: none;
        background: none;
        font-size: 16px;
        font-family: Whitney;
        padding-left: 0;
        color: #dbdee1;
        font-weight: 400;
    }

    input::placeholder {
        color: #79797d;
    }

    .message-caret {
        height: 44px;
        margin-inline: 16px;
        margin-bottom: 24px;

        background-color: var(--message-caret-bg);
        border-radius: 8px;
        display: flex;
        align-items: center;
    }
    .message-caret.pendingUploads {
        border-top-right-radius: 0;
        border-top-left-radius: 0;
        margin-top: 0;
    }

    .icon {
        color: #b5bac1;
        padding: 10px 16px;
        line-height: 0;
        cursor: pointer;
    }

    .attachment-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;

        background-color: var(--message-caret-bg);
        margin-inline: 16px;
        border-top-right-radius: 8px;
        border-top-left-radius: 8px;
        padding: 10px 16px;
        padding-top: 18px;

        max-height: 300px;
        overflow-y: auto;
    }

    .attachment-list::-webkit-scrollbar {
        width: 16px;
        height: 16px;
    }

    .attachment-list::-webkit-scrollbar-thumb {
        background-color: var(--bg-1);
        border: 4px solid var(--message-caret-bg);
        border-radius: 8px;
    }
</style>
