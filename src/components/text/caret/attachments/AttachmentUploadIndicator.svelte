<script lang="ts">
    import Tooltip from "src/components/base/Tooltip.svelte";
    import type { PendingUpload } from "src/lib/upload";
    import { humanFileSize } from "src/lib/util";
    import MaterialSymbolsCloseRounded from "~icons/material-symbols/close-rounded";
    import MaterialSymbolsUploadFile from "~icons/material-symbols/upload-file";

    export let upload: PendingUpload;
    export let onRemove: () => void = () => {};

    const isFileLarge = upload.file.size > 25_000_000;
    const fileSize = humanFileSize(upload.file.size, true, 0);

    let showPreview = !isFileLarge; // show previews under 25MB

    $: progress = Math.floor(upload.progress);
    $: finished = progress >= 100;
</script>

<div class="card">
    <div class="preview">
        {#if upload.started}
            <div class="progress-overlay">
                <span class="progress-number" class:finished>{progress}%</span>
                <progress class:finished value={progress} max="100" />
            </div>
        {/if}
        {#if upload.file.type.startsWith("image/")}
            {#if showPreview}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <img
                    class="preview-img"
                    src={URL.createObjectURL(upload.file)}
                    alt="Preview of {upload.file.name}"
                    on:click={() => {
                        if (isFileLarge) {
                            showPreview = false;
                        }
                    }}
                />
            {:else}
                <Tooltip>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <span
                        class="show-preview"
                        on:click={() => (showPreview = true)}
                        >Show Preview ({fileSize})</span
                    >
                    <span slot="text">
                        This image is quite large,<br />
                        and might lag your client<br />
                        if you preview it. ({fileSize})<br />
                        Click to show it anyway.
                    </span>
                </Tooltip>
            {/if}
        {:else}
            <div class="preview-placeholder">
                <MaterialSymbolsUploadFile font-size="64px" />
            </div>
        {/if}
    </div>
    <div class="bottom">
        <span class="file-name">{upload.file.name}</span>
        <span class="file-size">{fileSize}</span>
    </div>
    {#if !upload.started}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="close" on:click={onRemove}>
            <MaterialSymbolsCloseRounded font-size="16px" />
        </div>
    {/if}
</div>

<style>
    .card {
        position: relative;

        background: var(--bg-0);
        border-radius: 8px;
        padding: 8px;

        display: flex;
        flex-direction: column;
        gap: 2px;

        user-select: none;
    }

    .preview {
        position: relative;
        background: var(--bg-1);
        border-radius: 8px;

        height: 200px;
        width: 200px;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .bottom {
        max-width: 200px;
        white-space: nowrap;

        display: flex;
        justify-content: space-between;
        gap: 8px;
    }

    .file-name {
        min-width: 0;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .file-size {
        color: var(--gray);
    }

    .preview-img {
        max-width: 100%;
        max-height: 100%;
        object-fit: cover;
        border-radius: 2px;
    }

    .preview-placeholder {
        color: var(--message-caret-bg);
    }

    .show-preview {
        color: var(--gray);
        cursor: pointer;
    }

    .close {
        position: absolute;
        top: -5px;
        right: -5px;

        width: 25px;
        height: 25px;

        border-radius: 50%;

        background-color: var(--bg-2);
        color: var(--gray);
        cursor: pointer;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .close:hover {
        color: var(--red);
    }

    .progress-overlay {
        position: absolute;
        background-color: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(3px);
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 4px;
        border-radius: 8px;
    }

    .progress-number {
        color: var(--text-color);
    }

    .finished {
        color: var(--green);
    }

    progress {
        -webkit-appearance: none;
        appearance: none;
        border: none;
        background-color: transparent;
    }

    progress[value]::-webkit-progress-bar {
        background-color: var(--bg-0);
        border-radius: 8px;
        border: 4px solid var(--accent-color);
    }

    progress[value]::-webkit-progress-value {
        transition: width 0.1s ease-in-out;
        background-color: var(--accent-color);
        border-radius: 0px;
    }

    progress[value].finished::-webkit-progress-bar {
        border-color: var(--green);
    }
    progress[value].finished::-webkit-progress-value {
        background-color: var(--green);
    }
</style>
