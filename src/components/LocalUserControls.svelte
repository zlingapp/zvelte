<script lang="ts">
    import { logOut } from "../lib/auth";
    import { localUser, userSettingsOpen } from "../lib/stores";
    import Tooltip from "./base/Tooltip.svelte";
    import MaterialSymbolsSettings from "~icons/material-symbols/settings";

    $: [name, tag] = $localUser?.name.split("#");
</script>

<div class="user-controls">
    <div class="info">
        <Tooltip text="Click to Log Out">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <img src={$localUser.avatar} alt="avatar" on:click={logOut} />
        </Tooltip>
        <div class="name-tag">
            <div class="name">{name}</div>
            <div class="tag">#{tag}</div>
        </div>
    </div>
    <div class="actions">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
            class="action settings"
            on:click={() => ($userSettingsOpen = true)}
        >
            <MaterialSymbolsSettings font-size={17.5} />
        </div>
    </div>
</div>

<style>
    .user-controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .info {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .info img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
    }

    .name-tag {
        line-height: 16px;
        font-size: 14px;
    }

    .name {
        font-weight: bold;
    }

    .tag {
        color: var(--gray);
    }

    .actions {
        color: var(--gray);
        user-select: none;
    }

    .action {
        border-radius: 6px;
        padding: 4px;
        line-height: 0;
        cursor: pointer;
    }

    .action:hover {
        background-color: var(--bg-2);
        color: var(--accent-color);
    }
</style>
