<script lang="ts">
    import MajesticonsHashtagLine from "~icons/majesticons/hashtag-line";
    import ContextMenu from "../context-menus/base/ContextMenu.svelte";
    import ChannelContextMenu from "../context-menus/ChannelContextMenu.svelte";
    import type { Channel, TextChannel } from "../../lib/channel";
    import { currentChannel } from "../../lib/stores";
    import { unimplemented } from "../../lib/dev";

    export let channel: Channel; // pretend this says TextChannel, svelte's type system is slightly broken
    export let menuOpen = false;

    function switch_channel() {
        $currentChannel = channel as TextChannel;
    }

    function onMarkAsRead() {
        unimplemented();
        menuOpen = false;
    }

    function onCopyLink() {
        unimplemented();
        menuOpen = false;
    }

    function onEditChannel() {
        unimplemented();
        menuOpen = false;
    }

    function onDuplicateChannel() {
        unimplemented();
        menuOpen = false;
    }

    function onDeleteChannel() {
        unimplemented();
        menuOpen = false;
    }

    async function onCopyChannelId() {
        await navigator.clipboard.writeText(channel.id);
        menuOpen = false;
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<ContextMenu bind:open={menuOpen}>
    <div class="channel" on:click={switch_channel}>
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
        padding: 6px 0;
        cursor: pointer;
        border-radius: 6px;
        user-select: none;
    }

    .channel-name {
        padding-left: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .channel:hover {
        background-color: #404249;
        color: #fff;
    }
</style>
