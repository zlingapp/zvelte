<script lang="ts">
    import ContextMenu from "src/components/base/ContextMenu.svelte";
    import Tooltip from "src/components/base/Tooltip.svelte";
    import MessageContextMenu from "src/components/context-menus/MessageContextMenu.svelte";
    import MessageAttachments from "src/components/text/MessageAttachments.svelte";
    import { authFetch, urlRelativeToApiBase } from "src/lib/auth";
    import type { Message } from "src/lib/channel";
    import { unimplemented } from "src/lib/dev";
    import {
        currentChannel,
        dmChannelOpen,
        localUser,
        showInErrorModal
    } from "src/lib/stores";
    import { getErrorMessage } from "src/lib/util";

    export let message: Message;
    export let detailed: boolean = true;
    export let pending: boolean = false;

    $: formattedCreatedAt = message.createdAt.calendar(null, {
        sameDay: "[Today at] h:mm A",
        nextDay: "[Tomorrow at] h:mm A",
        nextWeek: "DD/MM/YYYY hh:mm: A",
        lastDay: "[Yesterday at] h:mm A",
        lastWeek: "DD/MM/YYYY hh:mm A",
        sameElse: "DD/MM/YYYY hh:mm A",
    });

    async function onDelete() {
        let dm = false;
        let channelId;

        if ($currentChannel == null && $dmChannelOpen != null) {
            dm = true;
            channelId = $dmChannelOpen.id;
        } else {
            channelId = $currentChannel!.id;
        }

        let resp = await authFetch(
            `/${dm ? "friends" : "channels"}/${channelId}/messages/${message.id}`,
            {
                method: "DELETE",
            }
        );

        if (!resp.ok) {
            const errorMessage = await getErrorMessage(resp);
            $showInErrorModal = `Deleting message failed: ${errorMessage}`
        }
    }

    $: localUser_ = $localUser!; // because typescript is dumb
</script>

<ContextMenu>
    <div class="message" class:detailed>
        {#if detailed}
            <ContextMenu>
                <img class="avatar" src={urlRelativeToApiBase(message.author.avatar).toString()} alt="avatar" />
            </ContextMenu>
            <div class="header">
                <span class="username">
                    {message.author.username.split("#")[0]}
                </span>

                <span class="time"
                    ><Tooltip
                        direction="right"
                        text={message.createdAt.format(
                            "DD/MM/YYYY HH:mm:ss G[M]T+0"
                        )}>{formattedCreatedAt}</Tooltip
                    ></span
                >
            </div>
        {/if}
        <div class="content" class:pending>
            {#if message.content}
                {message.content}
            {/if}
            {#if !detailed}
                <span class="time time-inline"
                    >{message.createdAt.format("hh:mm A")}</span
                >
            {/if}
        </div>
        {#if message.attachments?.length}
            <MessageAttachments attachments={message.attachments} />
        {/if}
    </div>
    <svelte:fragment slot="menu">
        {#if !pending}
            <MessageContextMenu
                onMarkAsRead={unimplemented}
                onCopyLink={unimplemented}
                onEdit={unimplemented}
                {onDelete}
                onCopyId={() => navigator.clipboard.writeText(message.id)}
                onCopyText={unimplemented}
                onReply={unimplemented}
                onPin={unimplemented}
                editAllowed={message.author.id === localUser_.id}
                modAllowed={message.author.id === localUser_.id}
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
        background-color: var(--message-hover-bg);
    }

    .username {
        /* font-weight: 600; */
        margin-right: 3px;
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
        font-weight: 400;
        line-height: 1.375rem;
        margin-top: -1px;
        color: var(--text-color);
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
        color:var(--gray);
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
