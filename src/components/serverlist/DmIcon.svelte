<script lang="ts">
    import ContextMenu from "../base/ContextMenu.svelte";
    import Tooltip from "../base/Tooltip.svelte";
    import { urlRelativeToApiBase } from "../../lib/auth";
    import type { PublicUserInfo } from "../../lib/channel";
    import DmIconContextMenu from "../context-menus/DmIconContextMenu.svelte";
    import { markDmRead, openDmWith, type UnreadDM } from "../../lib/friends";

    export let id: string;
    export let user: PublicUserInfo;
    export let unread: number = 0;

    function onCopyId() {
        navigator.clipboard.writeText(user.id);
    }

    function onMarkRead() {
        markDmRead(id);
    }

    function switchTo() {
        openDmWith(user);
    }
</script>

<ContextMenu>
    <Tooltip direction="right" selectable>
        <div class="guild-tooltip-name" slot="text">
            {user.username}
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
            class="server-list-button guild-icon"
            class:unread={unread > 0}
            on:click={switchTo}
        >
            <!-- svelte-ignore a11y-missing-attribute -->
            <img src={urlRelativeToApiBase(user.avatar).toString()} />
            <div class="unread-counter">{unread}</div>
        </div>
    </Tooltip>
    <DmIconContextMenu slot="menu" {onCopyId} {onMarkRead} />
</ContextMenu>

<style>
    @import "./ServerListItems.css";

    .guild-tooltip-name {
        font-weight: 600;
        user-select: none;
    }

    .unread-counter {
        position: absolute;
        right: 2px;
        bottom: 2px;

        width: 16px;
        height: 16px;
        border-radius: 8px;

        font-size: 12px;
        text-align: center;
        
        background-color: var(--red);
        color: white;

        line-height: 16px;
        font-weight: 600;
        outline: 5px solid var(--bg-2);
    }
</style>
