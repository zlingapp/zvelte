<script lang="ts">
    import MajesticonsHashtagLine from "~icons/majesticons/hashtag-line";
    import type { Channel, TextChannel } from "../../lib/channel";
    import { unimplemented } from "../../lib/dev";
    import { currentChannel } from "../../lib/stores";
    import ContextMenu from "../base/ContextMenu.svelte";
    import ChannelContextMenu from "../context-menus/ChannelContextMenu.svelte";

    export let channel: Channel; // pretend this says TextChannel, svelte's type system is slightly broken

    function switch_channel() {
        $currentChannel = channel as TextChannel;
    }

    function onMarkAsRead() {
        unimplemented();
    }

    function onCopyLink() {
        unimplemented();
    }

    function onEditChannel() {
        unimplemented();
    }

    function onDuplicateChannel() {
        unimplemented();
    }

    function onDeleteChannel() {
        unimplemented();
    }

    async function onCopyChannelId() {
        await navigator.clipboard.writeText(channel.id);
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<ContextMenu>
    <div class="channel" class:current={$currentChannel.id == channel.id}  on:click={switch_channel}>
        <p class="channel-name">
            <MajesticonsHashtagLine /><span>{channel.name}</span>
        </p>
    </div>
    <ChannelContextMenu
        onCopyId={onCopyChannelId}
        {onCopyLink}
        {onDeleteChannel}
        {onDuplicateChannel}
        {onEditChannel}
        {onMarkAsRead}
        slot="menu"
    />
</ContextMenu>

<style>
    .channel {
        color: #888b8f;
        padding: 5px 0;
        margin: 1px 0;
        cursor: pointer;
        border-radius: 6px;
        user-select: none;

        transition: all 75ms ease-in-out;
    }

    .channel-name {
        padding-left: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .channel.current {
        background-color: #2B2B2B;
        color: #fff;
    }

    /* not current */
    .channel:hover:not(.current) {
        background-color: #242424;
        color: #fff;
    }
</style>
