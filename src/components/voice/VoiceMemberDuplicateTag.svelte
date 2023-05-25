<script lang="ts">
    import Tooltip from "../base/Tooltip.svelte";

    export let text;
    export let is_me = false;
    export let tooltipDirection: any = "right";
</script>

<Tooltip direction={tooltipDirection}>
    <div class="identity-tooltip-text" slot="text">
        {#if is_me}
            You are
        {:else}
            This user is
        {/if} connected from two separate places.
        The tag
        <span class="identity">{text}</span> uniquely identifies {#if is_me}
            your
        {:else}
            that
        {/if} voice connection.
    </div>
    <div class="identity">
        <div class="dot"></div>
        {text}
    </div>
</Tooltip>

<style>
    .identity {
        font-weight: normal;
        font-family: monospace;
        background: var(--bg-2);
        padding: 2px 5px;
        font-size: 10px;
        border-radius: 5px;
        color: dodgerblue;
        cursor: help;

        display: inline-flex;
        align-items: center;
        gap: 4px;
    }

    .identity-tooltip-text {
        font-weight: normal;
        text-align: left;
        max-width: 200px;
        line-height: initial;
    }

    .dot {
        width: 5px;
        height: 5px;
        background-color: dodgerblue;
        border-radius: 50%;
    }
</style>
