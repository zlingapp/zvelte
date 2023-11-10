<script lang="ts">
    import type { Guild } from "../../lib/guild";
    import { currentGuild } from "../../lib/stores";
    import ContextMenu from "../base/ContextMenu.svelte";
    import GuildContextMenu from "../context-menus/GuildContextMenu.svelte";
    import Tooltip from "../base/Tooltip.svelte";
    import { urlRelativeToApiBase } from "../../lib/auth";

    export let guild: Guild;

    function onCopyId() {
        navigator.clipboard.writeText(guild.id);
    }

    function switchGuild() {
        if ($currentGuild?.id !== guild.id) {
            $currentGuild = guild;
        }
    }
</script>

<ContextMenu>
    <Tooltip direction="right" selectable>
        <div class="guild-tooltip-name" slot="text">
            {guild.name}
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
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
                <!-- svelte-ignore a11y-missing-attribute -->
                <img src={urlRelativeToApiBase(guild.icon).toString()} />
            {/if}
        </div>
    </Tooltip>
    <GuildContextMenu slot="menu" {onCopyId} />
</ContextMenu>

<style>
    @import "./ServerListItems.css";

    .guild-tooltip-name {
        font-weight: 600;
        user-select: none;
    }
</style>
