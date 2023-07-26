<script lang="ts">
    import type { UploadedFile, UploadedFileType } from "../../lib/upload";
    import type { PendingUpload } from "./MessageAttachButton.svelte";
    import MdiFile from '~icons/mdi/file';

    export let attachment: PendingUpload | UploadedFile;

    function isPending(attachment: any): attachment is PendingUpload {
        return attachment.url === undefined;
    }

    let url: string;
    let name: string;
    let type: UploadedFileType;

    $: {
        if (isPending(attachment)) {
            url = URL.createObjectURL(attachment.file);
            name = attachment.file.name;

            if (attachment.file.type.startsWith("image/")) {
                type = "image";
            } else if (attachment.file.type.startsWith("video/")) {
                type = "video";
            } else {
                type = "blob";
            }
        } else {
            url = attachment.url;
            name = attachment.name;
            type = attachment.type;
        }
    }
</script>

<div class="attachment">
    {#if type === "image"}
        <img src={url} alt={name} class="multimedia" />
    {:else if type === "video"}
        <!-- svelte-ignore a11y-media-has-caption -->
        <video src={url} class="multimedia" controls></video>
    {:else}
        <a class="file" href={url} download="{name}" target=”_blank”>
            <MdiFile font-size="30px" color="var(--gray)" />
            <div class="file-info">
                <div class="file-link">{name}</div>
                <div class="file-size">64KB</div>
            </div>
        </a>
    {/if}
</div>

<style>
    .multimedia {
        max-width: 400px;
        max-height: 200px;
        height: fit-content;
        object-fit: contain;
        border-radius: 5px;
        background-color: var(--bg-1);
        box-shadow: 0px 1px 2px 0 rgba(0, 0, 0, 0.2);
        box-sizing: border-box;
        cursor: pointer;
    }

    .attachment {
        margin-block: auto;
        line-height: 0;
    }

    .file {
        line-height: 1;
        background-color: var(--bg-1);
        padding: 16px;
        border-radius: 8px;
        display: flex;
        text-decoration: none;
    }

    .file-link {
        color: rgb(0, 168, 252);
    }

    .file-info {
        margin-inline: 8px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .file-size {
        color: var(--gray);
        font-size: 14px;
    }
</style>
