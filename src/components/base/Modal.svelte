<script lang="ts">
    import MaterialSymbolsCloseRounded from "~icons/material-symbols/close-rounded";

    export let show: boolean = false;
    export let onClose: () => void = () => show = false;

    let dialog: HTMLDialogElement;

    $: {
        if (dialog)
            if (show) dialog.showModal();
            else dialog.close();
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if show}
    <dialog
        bind:this={dialog}
        on:close={onClose}
        on:click|self={() => dialog.close()}
    >
        <div on:click|stopPropagation>
            <div class="title">
                <slot name="title" />
                <span style="flex-grow: 1;" />
                <button class="close" on:click={() => dialog.close()}>
                    <MaterialSymbolsCloseRounded />
                </button>
            </div>
            <div class="content">
                <slot name="content" />
            </div>
            <div class="actions">
                <slot name="actions" />
            </div>
        </div>
    </dialog>
{/if}

<style>
    dialog {
        border-radius: 6px;
        border: none;
        padding: 0;

        background-color: var(--bg-0);
        color: inherit;

        box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px,
            rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
    }

    dialog > div > div {
        padding: 16px;
    }

    dialog::backdrop {
        background: rgba(0, 0, 0, 0.5);
    }

    dialog[open] {
        animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @keyframes zoom {
        from {
            transform: scale(0.95);
        }
        to {
            transform: scale(1);
        }
    }

    dialog[open]::backdrop {
        animation: fade 0.2s ease-out;
    }

    @keyframes fade {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .title {
        font-weight: bold;
        display: flex;
        background-color: var(--bg-2);
        align-items: center;
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
</style>
