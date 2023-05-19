<script lang="ts">
    import MaterialSymbolsAddCircle from "~icons/material-symbols/add-circle";
    import {
        currentChannel,
        currentGuild,
        eventSocket,
    } from "../../lib/stores";

    import TwemojiGrinningFaceWithSmilingEyes from "~icons/twemoji/grinning-face-with-smiling-eyes";
    import FluentSend20Filled from "~icons/fluent/send-20-filled";
    import { auth_fetch } from "../../lib/auth";
    import { onMount } from "svelte";

    let value;
    let sendButton: HTMLDivElement;

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
                if (e.ctrlKey || e.metaKey || e.altKey && e.which == 8) {
                    break;
                }
                if (!(e.keyCode >= 48 && e.keyCode <= 57) && !(e.keyCode >= 65 && e.keyCode <= 90)) {
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

        await auth_fetch(
            `/api/guilds/${$currentGuild.id}/channels/${$currentChannel.id}/messages`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: value }),
            }
        );

        value = "";
    }
</script>

<div class="message-caret-container">
    <div class="message-caret">
        <div class="icon">
            <MaterialSymbolsAddCircle style="font-size: 20px;" />
        </div>
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
        background-color: #383a40;
        border-radius: 8px;
        display: flex;
        align-items: center;
    }

    .icon {
        color: #b5bac1;
        padding: 10px 16px;
        line-height: 0;
        cursor: pointer;
    }
</style>
