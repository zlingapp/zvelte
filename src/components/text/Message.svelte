<script lang="ts">
    import { unimplemented } from "../../lib/dev";
    import { localUser } from "../../lib/stores";
    import ContextMenu from "../base/ContextMenu.svelte";
    import ChannelContextMenu from "../context-menus/ChannelContextMenu.svelte";
    import MessageContextMenu from "../context-menus/MessageContextMenu.svelte";

    export let message: any;
    export let detailed: boolean = true;
</script>

<ContextMenu>
    <div class="message" class:detailed>
        {#if detailed}
            <ContextMenu>
                <img class="avatar" src={message.author.avatar} alt="avatar" />
            </ContextMenu>
            <div class="header">
                {message.author.username.split("#")[0]}
                <span class="time">{message.created_at}</span>
            </div>
        {/if}
        <div class="content">{message.content}</div>
    </div>
    <MessageContextMenu
        onMarkAsRead={unimplemented}
        onCopyLink={unimplemented}
        onEdit={unimplemented}
        onDelete={unimplemented}
        onCopyId={unimplemented}
        onCopyText={unimplemented}
        onReply={unimplemented}
        onPin={unimplemented}
        editAllowed={message.author.id === $localUser.id}
        modAllowed={message.author.id === $localUser.id}
        slot="menu"
    />
</ContextMenu>

<style>
    .message {
        position: relative;
        /* min-height: 2.75rem; */
        padding-left: 72px;
        padding-top: 0.125rem;
        padding-bottom: 0.125rem;
        padding-right: 48px;
    }

    .message:hover {
        background-color: #2e3035;
    }

    .detailed {
        margin-top: 1.0625rem;
    }

    .avatar {
        position: absolute;
        left: 16px;
        margin-top: calc(4px - 0.125rem);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
        cursor: pointer;
        user-select: none;
        flex: 0 0 auto;
    }
    .content {
        font-size: 1rem;
        font-weight: 500;
        line-height: 1.375rem;
        margin-top: -1px;
        color: var(--header-primary);
        vertical-align: baseline;
        position: relative;
        word-wrap: break-word;
        word-break: break-all;
    }

    .header {
        font-size: 1rem;
        font-weight: 500;
        line-height: 1.375rem;
        color: var(--header-primary);
        display: inline;
        vertical-align: baseline;
        position: relative;
        overflow: hidden;
    }

    .time {
        font-size: 0.75rem;
        line-height: 1.375rem;
        color: #949ba4;
    }
</style>
