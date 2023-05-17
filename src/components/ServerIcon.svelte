<script lang="ts">
    import type { Guild } from "../lib/guild";
    import { currentGuild } from "../lib/stores";
    import ContextMenu from "./context-menus/base/ContextMenu.svelte";
    import GuildContextMenu from "./context-menus/GuildContextMenu.svelte";
    import Tooltip from "./Tooltip.svelte";

    export let guild: Guild;

    let isContextMenuOpen = false;

    function onCopyId() {
        isContextMenuOpen = false;
        navigator.clipboard.writeText(guild.id);
    }
</script>

<ContextMenu bind:open={isContextMenuOpen}>
    <Tooltip direction="right" selectable>
        <div class="guild-tooltip-name" slot="text">
            {guild.name}
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
            class="guild-icon"
            class:current={guild.id == $currentGuild?.id}
            on:click={() => {
                $currentGuild = { ...guild };
            }}
        >
            {guild.name[0].toUpperCase()}
        </div>
    </Tooltip>
    <GuildContextMenu slot="menu" {onCopyId} />
</ContextMenu>

<style>
    .guild-tooltip-name {
        font-weight: 600;
    }

    .current {
        outline: 3px solid rgba(255, 255, 255, 0.2);
        border-radius: 40%;
    }
</style>
