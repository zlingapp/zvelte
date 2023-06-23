<script lang="ts">
    import type { Message } from "../../lib/channel";
    import { unimplemented } from "../../lib/dev";
    import { localUser } from "../../lib/stores";
    import ContextMenu from "../base/ContextMenu.svelte";
    import Tooltip from "../base/Tooltip.svelte";
    import MessageContextMenu from "../context-menus/MessageContextMenu.svelte";

    export let message: Message;
    export let detailed: boolean = true;
    export let pending: boolean = false;

    $: formattedCreatedAt = message.created_at.calendar(null, {
        sameDay: "[Today at] h:mm A",
        nextDay: "[Tomorrow at] h:mm A",
        nextWeek: "DD/MM/YYYY hh:mm: A",
        lastDay: "[Yesterday at] h:mm A",
        lastWeek: "DD/MM/YYYY hh:mm A",
        sameElse: "DD/MM/YYYY hh:mm A",
    });
</script>

<ContextMenu>
    <div class="message" class:detailed>
        {#if detailed}
            <ContextMenu>
                <img class="avatar" src={message.author.avatar} alt="avatar" />
            </ContextMenu>
            <div class="header">
                {message.author.username.split("#")[0]}

                <span class="time"
                    ><Tooltip
                        direction="right"
                        text={message.created_at.format(
                            "DD/MM/YYYY HH:mm:ss G[M]T+0"
                        )}>{formattedCreatedAt}</Tooltip
                    ></span
                >
            </div>
        {/if}
        <div class="content" class:pending>
            {message.content}
            {#if !detailed}
                <span class="time time-inline"
                    >{message.created_at.format("hh:mm A")}</span
                >
            {/if}
        </div>
    </div>
    <svelte:fragment slot="menu">
        {#if !pending}
            <MessageContextMenu
                onMarkAsRead={unimplemented}
                onCopyLink={unimplemented}
                onEdit={unimplemented}
                onDelete={unimplemented}
                onCopyId={() => navigator.clipboard.writeText(message.id)}
                onCopyText={unimplemented}
                onReply={unimplemented}
                onPin={unimplemented}
                editAllowed={message.author.id === $localUser.id}
                modAllowed={message.author.id === $localUser.id}
            />
        {/if}
    </svelte:fragment>
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
    .detailed {
        margin-top: 1.0625rem;
    }
    .message:hover {
        background-color: #262626;
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
        color: #a3a3a3;
        user-select: none;
    }

    .time-inline {
        position: absolute;
        left: 0;
        transform: translate(calc(-100% - 8px), 2px);
        opacity: 0;
    }

    .message:hover .time-inline {
        opacity: 1;
    }

    .pending {
        color: var(--disabled-text);
    }
</style>
