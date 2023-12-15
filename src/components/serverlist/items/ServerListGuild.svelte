<script lang="ts">
    import ContextMenu from "src/components/base/ContextMenu.svelte";
    import Tooltip from "src/components/base/Tooltip.svelte";
    import GuildContextMenu from "src/components/context-menus/GuildContextMenu.svelte";
    import { urlRelativeToApiBase } from "src/lib/auth";
    import type { Guild } from "src/lib/guild";
    import { currentGuild, currentDmChannel } from "src/lib/stores";

    export let guild: Guild;

    function onCopyId() {
        navigator.clipboard.writeText(guild.id);
    }

    function switchGuild() {
        if ($currentGuild?.id === guild.id) {
            return;
        }
        $currentGuild = guild;
        $currentDmChannel = null;
    }
</script>

<ContextMenu>
    <Tooltip direction="right" selectable>
        <div class="guild-tooltip-name" slot="text">
            {guild.name}
        </div>
        <div
            class="server-list-button guild-icon"
            class:current={guild.id == $currentGuild?.id}
            on:click={switchGuild}
        >
            {#if guild.icon == null}
                <span class="no-image">
                    {guild.name[0]}
                </span>
            {:else}
                <img src={urlRelativeToApiBase(guild.icon).toString()} />
            {/if}
        </div>
    </Tooltip>
    <GuildContextMenu slot="menu" {onCopyId} />
</ContextMenu>

<!-- svelte-ignore css-unused-selector -->
<style>
    @import "./ServerListItems.css";

    .guild-tooltip-name {
        font-weight: 600;
        user-select: none;
    }
</style>
