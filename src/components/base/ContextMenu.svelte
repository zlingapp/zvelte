<script lang="ts">
    import { onMount } from "svelte";
    import { clickOutside } from "../../lib/clickOutside";
    import { contextMenu } from "../../lib/stores";
    import { slide } from "svelte/transition";

    export let animate = false;
    export let open = false;
    export let x = 0;
    export let y = 0;


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

    function ensureNotOffscreen(node) {
        const rect = node.getBoundingClientRect();

        if (rect.right > window.innerWidth) {
            x -= rect.right - window.innerWidth + 10;
        }

        if (rect.bottom > window.innerHeight) {
            y -= rect.bottom - window.innerHeight + 10;
        }
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
        use:ensureNotOffscreen
        on:click_outside={close}
        on:click={close}
        in:slide={{duration: animate ? 500 : 0}}
    >
        <slot name="menu" />
    </div>
{/if}

<style>
    .context {
        position: fixed;
        z-index: 5;

        min-width: 172.77px;

        background-color: var(--context-menu-bg);
        border-radius: 4px;
        padding: 6px 6px;

        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        user-select: none;
    }
</style>
