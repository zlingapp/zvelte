<script lang="ts">
    import MessageAttachButton from "../text/MessageAttachButton.svelte";
    import MaterialSymbolsAddCircle from "~icons/material-symbols/add-circle";
    import FluentSend20Filled from "~icons/fluent/send-20-filled";
    import TwemojiGrinningFaceWithSmilingEyes from "~icons/twemoji/grinning-face-with-smiling-eyes";
</script>

<div class="message-caret-container">
    <div class="message-caret">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="upload-icon" on:click={()=>{}}>
                <MaterialSymbolsAddCircle style="font-size: 20px;" />
        </div>
        <input disabled class="input" placeholder="Send a message" />
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="icon" style="padding-inline: 8px;" on:click={() => {}}>
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
    .upload-icon {
        color: #b5bac1;
        padding: 10px 16px;
        line-height: 0;
        cursor: pointer;
    }
    input {
        border: none;
        background: none;
        font-size: 16px;
        font-family: inherit;
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

    .icon {
        color: #b5bac1;
        padding: 10px 16px;
        line-height: 0;
        cursor: pointer;
    }
</style>
