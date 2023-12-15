<script lang="ts">
    import IcRoundCheck from '~icons/ic/round-check';

    let done = false;
    export let onClick: () => void = () => {};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->

<div
    class="btn"
    on:click={() => {
        onClick();
        done = true;
        setTimeout(() => {
            done = false;
        }, 1000);
    }}
>
    {#if done}
        <IcRoundCheck color="var(--green)" />
    {:else}
        <slot />
    {/if}
</div>

<style>
    .btn {
        cursor: pointer;
        width: 20px;
        height: 20px;
    }
</style>
