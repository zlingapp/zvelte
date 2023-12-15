<script lang="ts">
    import {
        currentGuildChannel,
        localUser,
        pendingOutgoingMessage,
        showInErrorModal,
    } from "src/lib/stores";

    import dayjs from "dayjs";
    import AttachmentUploadIndicator from "src/components/text/caret/attachments/AttachmentUploadIndicator.svelte";
    import MessageAttachButton from "src/components/text/caret/attachments/MessageCaretAttachButton.svelte";
    import { authFetch } from "src/lib/auth";
    import type { TextChannel } from "src/lib/channel";
    import { getErrorMessage } from "src/lib/util";
    import { onMount } from "svelte";
    import { flip } from "svelte/animate";
    import FluentSend20Filled from "~icons/fluent/send-20-filled";
    import TwemojiGrinningFaceWithSmilingEyes from "~icons/twemoji/grinning-face-with-smiling-eyes";
    import type { PendingUpload } from "src/lib/upload";

    let value: string;
    let sendButton: HTMLDivElement;

    // bound to the MessageAttachButton component
    let uploadAllAttachments: () => Promise<void>;
    let pendingUploads: PendingUpload[];

    export let dm: boolean = false;
    export let channel: TextChannel;

    let typingLastSent = 0;
    const RESEND_TYPING_EVERY = 4000;

    onMount(() => {
        currentGuildChannel.subscribe(() => {
            typingLastSent = 0;
        });
    });

    function onKeyUp(e: KeyboardEvent) {
        switch (e.key) {
            case "Enter":
                if (e.shiftKey) {
                    value += "\n";
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
        await authFetch(
            `/${dm ? "friends" : "channels"}/${channel.id}/typing`,
            {
                method: "POST",
            },
        );
    }

    async function send() {
        const noText = value == null || value == "";
        if (noText && pendingUploads.length == 0) {
            return;
        }

        const content = value;
        value = "";

        $pendingOutgoingMessage = {
            // identifiable in case this bad boy somehow gets sent to the backend
            id: "zvelte-pending",
            content,
            author: {
                id: $localUser!.id,
                avatar: $localUser!.avatar,
                username: $localUser!.name,
                // TODO: resolve nickname here, maybe through guild Member
            },
            createdAt: dayjs(),
            attachments: pendingUploads,
        };

        // do upload
        if (pendingUploads.length > 0) {
            try {
                await uploadAllAttachments();
            } catch (e) {
                // show an error
                $showInErrorModal = `Failed to upload attachments: ${e}`;

                // clear the pending uploads list
                pendingUploads = [];

                // message failed to send, so remove the pending message
                $pendingOutgoingMessage = null;
                return;
            }
        }

        const attachments = pendingUploads
            .map((pu) => pu.uploadedFile)
            .filter((a) => a != null);

        pendingUploads = [];

        const resp = await authFetch(
            `/${dm ? "friends" : "channels"}/${channel.id}/messages`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content, attachments }),
            },
        );

        if (!resp.ok) {
            const errorMessage = await getErrorMessage(resp);
            $showInErrorModal = `Failed to send message: ${errorMessage}`;
            // message failed to send, so remove the pending message
            $pendingOutgoingMessage = null;
            return;
        }

        // immediately send typing upon next keystrokes
        // this is needed here because clients usually immediately remove the
        // typing indicator when the user sends a message
        // if this wasn't here, even if the user started typing immediately
        // after sending a message, the typing event wouldn't be sent until the
        // next 4 second cycle, leading to a delay in the typing indicator
        // appearing for everyone else
        typingLastSent = 0;
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
            placeholder="Message #{channel.name}"
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
        font-family: inherit;
        padding-left: 0;
        color: var(--message-caret-fg);
        font-weight: 400;
    }

    input::placeholder {
        color: var(--gray);
    }

    .message-caret {
        height: 44px;
        margin-inline: 16px;
        margin-bottom: 24px;

        background-color: var(--message-caret-bg);
        border-radius: 8px;
        display: flex;
        align-items: center;

        box-shadow:
            inset 0 0.5px 0px rgba(255, 255, 255, 0.1),
            0 1px 6px 0px rgba(0, 0, 0, 0.1);
    }
    .message-caret.pendingUploads {
        border-top-right-radius: 0;
        border-top-left-radius: 0;
        margin-top: 0;
    }

    .icon {
        color: var(--gray-2);
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

        box-shadow:
            inset 0 0.5px 0px rgba(255, 255, 255, 0.1),
            0 1px 6px 0px rgba(0, 0, 0, 0.1);
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
