<script lang="ts">
    import ContextMenu from "src/components/base/ContextMenu.svelte";
    import ChannelContextMenu from "src/components/context-menus/ChannelContextMenu.svelte";
    import type { Channel, TextChannel } from "src/lib/channel";
    import { unimplemented } from "src/lib/dev";
    import { currentGuildChannel } from "src/lib/stores";
    import MajesticonsHashtagLine from "~icons/majesticons/hashtag-line";

    export let channel: Channel; // pretend this says TextChannel, svelte's type system is slightly broken

    function switchChannel() {
        $currentGuildChannel = channel as TextChannel;
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
    <div class="channel" class:current={$currentGuildChannel?.id == channel.id}  on:click={switchChannel}>
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
        color: var(--channel-fg);
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
        background-color: var(--channel-current-bg);
        color: var(--channel-current-fg);

        box-shadow: inset 0 0.5px 0px rgba(255, 255, 255, 0.1);
    }

    /* not current */
    .channel:hover:not(.current) {
        background-color: var(--channel-hover-bg);
        color: var(--channel-hover-fg);
    }
</style>
