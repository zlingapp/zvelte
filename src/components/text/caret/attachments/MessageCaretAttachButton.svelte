<script lang="ts">
    import MaterialSymbolsAddCircle from "~icons/material-symbols/add-circle";
    import {
        FILESIZE_LIMIT_ATTACHMENTS,
        uploadFile,
        type UploadedFile,
        type PendingUpload,
    } from "src/lib/upload";
    import { humanFileSize } from "src/lib/util";

    let input: HTMLInputElement;
    export let pendingUploads: PendingUpload[] = [];

    async function inputChanged(event: any) {
        let newFiles: File[] = [...event.target.files];
        // clear input files
        event.target.value = "";

        for (const file of newFiles) {
            if (file.size > FILESIZE_LIMIT_ATTACHMENTS) {
                alert(
                    `File ${
                        file.name
                    } is too large. Maximum file size is ${humanFileSize(
                        FILESIZE_LIMIT_ATTACHMENTS,
                        true,
                        0
                    )}`
                );
                return;
            }
        }

        pendingUploads = [
            ...pendingUploads,
            ...newFiles.map((file) => ({
                randomLocalId: Math.random().toString(36).slice(2),
                file,
                progress: 0,
                started: false,
            })),
        ];
    }

    export const uploadAll = async () => {
        const futures = pendingUploads.map((pendingUpload) =>
            startUpload(pendingUpload)
        );
        await Promise.all(futures);
    };

    async function startUpload(pendingUpload: PendingUpload) {
        if (pendingUpload.started) return;
        pendingUpload.started = true; // mark upload as started
        pendingUploads = pendingUploads; // refresh pendingUploads

        const uploadedFile = await uploadFile(pendingUpload.file, (e) => {
            if (e.lengthComputable) {
                pendingUpload.progress = (e.loaded / e.total) * 100; // compute progress
                pendingUploads = pendingUploads; // refresh pendingUploads
            }
        });

        pendingUpload.uploadedFile = uploadedFile; // set uploadedFile to mark completion
        pendingUpload.progress = 100; // set progress to 100%
        pendingUploads = pendingUploads; // refresh pendingUploads
    }
</script>

<input on:change={inputChanged} type="file" multiple bind:this={input} />
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="icon" on:click={() => input.click()}>
    <MaterialSymbolsAddCircle style="font-size: 20px;" />
</div>

<style>
    .icon {
        color: var(--gray-2);
        padding: 10px 16px;
        line-height: 0;
        cursor: pointer;
    }

    input {
        display: none;
    }
</style>
