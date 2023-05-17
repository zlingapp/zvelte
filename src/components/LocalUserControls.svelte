<script lang="ts">
    import { logOut } from "../lib/auth";
    import { localUser } from "../lib/stores";
    import Tooltip from "./base/Tooltip.svelte";

    $: [name, tag] = $localUser?.name.split('#');
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
</div>

<style>
    .user-controls {
        display: flex;
        align-items: center;
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
</style>
