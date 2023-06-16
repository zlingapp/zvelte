<script lang="ts">
    import { auth_fetch } from "../../lib/auth";
    import Button from "./Button.svelte";

    import BiQuestionSquare from '~icons/bi/question-square';
    import MaterialSymbolsUploadFile from "~icons/material-symbols/upload-file";
    import { humanFileSize } from "../../lib/util";

    let input: HTMLInputElement;

    interface UploadedFile {
        id: string;
        name: string;
        url: string;
    };

    export let uploadedFile: UploadedFile = null;
    export let sizeLimit = 1000000; // 5mb
    export let defaultImage: string = null;
    export let onChange: Function = (UploadedFile) => {};
    
    let loading = false;

    async function imageChanged(event) {
        uploadedFile = null;

        const file: File = event.target.files[0];

        // 25mb
        if (file.size > sizeLimit) {
            alert("File too large");
            return;
        }

        const form = new FormData();
        form.append("file", file);

        loading = true;
        let res = await auth_fetch("/api/media/upload", {
            method: "POST",
            body: form,
        });
        loading = false;

        if (res.ok) {
            uploadedFile = await res.json();
            onChange(uploadedFile);
        } else {
            console.error(res);
        }
    }
</script>

<div class="icon-upload">
    {#if uploadedFile || defaultImage}
        <div class="present-image">
            <!-- svelte-ignore a11y-missing-attribute -->
            <img class="icon" src={uploadedFile?.url || defaultImage} />
            {#if uploadedFile?.name}
                <span class="filename">{uploadedFile.name}</span>
            {/if}
        </div>
    {:else}
        <div class="icon">
            <BiQuestionSquare font-size="24px" />
        </div>
    {/if}

    {#if loading}
        <div>Uploading...</div>
    {:else}
        <div class="upload">
            <input
                on:change={imageChanged}
                type="file"
                accept="image/png, image/jpeg"
                bind:this={input}
            />
            <Button accent onClick={() => input.click()}>
                <div class="browse">
                    <MaterialSymbolsUploadFile font-size="16px" />
                    Select
                </div>
            </Button>
            <div>Maximum {humanFileSize(sizeLimit, true, 0)},<br />at least 64x64</div>
        </div>
    {/if}
</div>

<style>
    .icon-upload {
        width: 100%;
        min-height: 100px;
        border-radius: 6px;

        display: flex;
        align-items: center;
        justify-content: center;
        gap: 25px;
    }

    .icon {
        width: 64px;
        height: 64px;
        background: var(--bg-2);
        border-radius: 50%;

        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--bg-0)
    }

    .upload {
        max-width: 150px;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    input {
        display: none;
    }

    .browse {
        display: flex;
        align-items: center;
        gap: 6px;
        line-height: 0;
    }

    .present-image {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
    }

    .filename {
        font-size: 12px;
        color: var(--gray);
        word-wrap: break-word;
        
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        max-width: 64px;
        text-align: center;
    }
</style>
