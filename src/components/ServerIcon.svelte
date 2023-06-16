<script lang="ts">
    import type { Guild } from "../lib/guild";
    import { currentGuild } from "../lib/stores";
    import ContextMenu from "./base/ContextMenu.svelte";
    import GuildContextMenu from "./context-menus/GuildContextMenu.svelte";
    import Tooltip from "./base/Tooltip.svelte";

    export let guild: Guild;

    function onCopyId() {
        navigator.clipboard.writeText(guild.id);
    }

    function switchGuild() {
        if ($currentGuild?.id !== guild.id) {
                        $currentGuild = { ...guild };
                    }
    }
</script>

<ContextMenu>
    <Tooltip direction="right" selectable>
        <div class="guild-tooltip-name" slot="text">
            {guild.name}
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        {#if guild.icon != null}
            <!-- svelte-ignore a11y-missing-attribute -->
            <img
                src={guild.icon}
                class="guild-icon"
                class:current={guild.id == $currentGuild?.id}
                on:click={switchGuild}
            />
        {:else}
            <div
                class="guild-icon"
                class:current={guild.id == $currentGuild?.id}
                on:click={switchGuild}
            >
                {#if guild.icon == null}
                    {guild.name[0].toUpperCase()}
                {/if}
            </div>
        {/if}
    </Tooltip>
    <GuildContextMenu slot="menu" {onCopyId} />
</ContextMenu>

<style>
    .guild-tooltip-name {
        font-weight: 600;
        user-select: none;
    }
    .current {
        outline: 3px solid rgba(255, 255, 255, 0.2);
        border-radius: 40%;
        user-select: none;
    }
</style>
