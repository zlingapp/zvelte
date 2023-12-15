<script lang="ts">
    import { fade } from "svelte/transition";
    import MaterialSymbolsCloseRounded from "~icons/material-symbols/close-rounded";

    // accessor for the slots of this component
    const slots = $$props.$$slots;

    export let show: boolean = false;

    export let onClose: () => void = () => (show = false);

    export let dimmed = true;
    export let draggable = false;

    let element: HTMLDivElement;

    // yes these are null at first but they get set in the $: block
    let x: number | null = null;
    let y: number | null = null;

    let moving = false;

    $: {
        if (draggable && show && element) {
            // set x and y to the center of the screen initially
            if (x === null) {
                x = window.innerWidth / 2 - element.clientWidth / 2;
            }
            if (y === null) {
                y = window.innerHeight / 2 - element.clientHeight / 2;
            }
        }
    }

    function onPointerDown() {
        // short-circuit dragging operations if the modal isnt draggable
        if (!draggable) return;
        moving = true;
    }

    function onPointerMove(e: MouseEvent) {
        // short-circuit dragging operations if the modal isnt draggable
        if (!draggable || !x || !y) return;

        if (moving) {
            // where we want to move to
            let newX = x + e.movementX;
            let newY = y + e.movementY;

            const maxX = window.innerWidth - element.clientWidth;
            const maxY = window.innerHeight - element.clientHeight;

            // clamp between 0 and the max size
            x = Math.min(Math.max(newX, 0), maxX);
            y = Math.min(Math.max(newY, 0), maxY);
        }
    }

    function onPointerUp() {
        if (!draggable) return;
        moving = false;
    }
</script>

{#if show}
    <div
        class="backdrop"
        class:dimmed
        on:pointerdown|self={onClose}
        transition:fade={{ duration: 100 }}
    >
        <div
            bind:this={element}
            class="modal"
            class:draggable
            style:--x={x + "px"}
            style:--y={y + "px"}
        >
            <div on:click|stopPropagation>
                <div
                    class="title"
                    on:pointerdown={onPointerDown}
                    class:draggable
                >
                    <slot name="title" />
                    <span style="flex-grow: 1;" />
                    <button class="close" on:click={onClose}>
                        <MaterialSymbolsCloseRounded />
                    </button>
                </div>
                <div class="content">
                    <slot name="content" />
                </div>
                {#if slots.actions}
                    <div class="actions">
                        <slot name="actions" />
                    </div>
                {/if}
            </div>
        </div>
    </div>
{/if}

<svelte:window on:pointermove={onPointerMove} on:pointerup={onPointerUp} />

<style>
    .modal {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        border-radius: 6px;
        border: transparent;
        padding: 0;
        background-color: var(--bg-0);
        color: inherit;

        box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px,
            rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;

        animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

        pointer-events: all;
    }

    .title,
    .content,
    .actions {
        padding: 16px;
    }

    .backdrop {
        content: "";
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 10;
        pointer-events: none;
    }

    .backdrop.dimmed {
        background: rgba(0, 0, 0, 0.5);
        pointer-events: all;
    }

    .modal.draggable {
        top: var(--y);
        left: var(--x);
        transform: none;
        animation: zoom-draggable 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .title.draggable {
        user-select: none;
        cursor: move;
    }

    .title {
        font-weight: bold;
        display: flex;
        background-color: var(--bg-2);
        align-items: center;

        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
    }

    .close {
        padding: 0;
        border: 0;
        border-radius: 50%;
        margin-right: 3px;

        background: none;

        color: var(--gray);
        line-height: 0;

        transform: scale(1.5);

        cursor: pointer;

        width: fit-content;
        height: fit-content;
    }

    .close:hover {
        color: inherit;
        background-color: rgba(0, 0, 0, 0.3);
        outline: 3px solid rgba(0, 0, 0, 0.3);
    }

    .content {
        min-height: 50px;
        padding-top: 20px;
        padding-bottom: 20px;
    }

    .actions {
        border-top: 1px dashed rgba(255, 255, 255, 0.15);
        display: flex;
        justify-content: flex-end;
        gap: 8px;
    }

    @keyframes zoom {
        from {
            transform: translate(-50%, -50%) scale(0.95);
        }
        to {
            transform: translate(-50%, -50%) scale(1);
        }
    }

    @keyframes zoom-draggable {
        /* same as above except with transform missing */
        from {
            transform: scale(0.95);
        }
        to {
            transform: scale(1);
        }
    }
</style>
