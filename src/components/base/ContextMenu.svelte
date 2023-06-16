<script lang="ts">
    import { onMount } from "svelte";
    import { clickOutside } from "../../lib/clickOutside";
    import { contextMenu } from "../../lib/stores";

    let open = false;
    let x = 0;
    let y = 0;

    function onContext(e) {
        // this doesn't really mean anything, it's just to trigger the store event lol
        $contextMenu = !$contextMenu;

        open = true;
        x = e.clientX;
        y = e.clientY;
    }

    function close() {
        open = false;
    }

    onMount(() => contextMenu.subscribe(close));
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:contextmenu|preventDefault|stopPropagation={onContext}>
    <slot />
</div>
{#if open}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
        class="context"
        style="left: {x}px; top: {y}px;"
        use:clickOutside
        on:click_outside={close}
        on:click={close}
    >
        <slot name="menu" />
    </div>
{/if}

<style>
    .context {
        position: fixed;
        z-index: 5;

        min-width: 172.77px;

        background-color: #111214;
        border-radius: 4px;
        padding: 6px 6px;

        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        user-select: none;
    }
</style>
