<script lang="ts">
    export let latency: number;


    import HealthiconsHighBars from "~icons/healthicons/high-bars";

    import HealthiconsMediumBars from '~icons/healthicons/medium-bars'

    import HealthiconsLowBars from '~icons/healthicons/low-bars'
    import Tooltip from "./Tooltip.svelte";
</script>

<Tooltip text={latency + 'ms'}>
    <div class="icon red" class:green={latency <= 100} class:yellow={latency <= 300}>
        {#if latency <= 100}
            <HealthiconsHighBars />
        {:else if latency <= 300}
            <HealthiconsMediumBars />
        {:else}
            <HealthiconsLowBars />
        {/if}
    </div>
</Tooltip>

<style>
    .icon {
        line-height: 0;
        cursor: pointer;
    }

    .red {
        color: var(--red);
    }

    .yellow {
        color: var(--yellow);
    }

    .green {
        color: var(--green);
    }
</style>