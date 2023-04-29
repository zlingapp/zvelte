<script lang="ts">
    import MaterialSymbolsAddCircle from "~icons/material-symbols/add-circle";
    import { currentChannel, currentGuild, eventSocket } from "../../lib/stores";

    import TwemojiGrinningFaceWithSmilingEyes from "~icons/twemoji/grinning-face-with-smiling-eyes";
    import FluentSend20Filled from "~icons/fluent/send-20-filled";

    let value;
    let sendButton: HTMLDivElement;

    function onKeyUp(e: KeyboardEvent) {
        if (e.key !== "Enter") return;
        sendButton.click();
        e.preventDefault();
    }

    async function send() {
        if (value == null || value == "") {
            return;
        }

        await fetch(`/api/channels/send`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                guild_id: $currentGuild.id,
                channel_id: $currentChannel.id,
                content: value,
            }),
        });

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