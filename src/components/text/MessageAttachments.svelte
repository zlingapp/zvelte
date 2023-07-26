<script lang="ts">
    import type { UploadedFile } from "../../lib/upload";
    import Attachment from "./Attachment.svelte";
    import type { PendingUpload } from "./MessageAttachButton.svelte";

    export let attachments: (PendingUpload | UploadedFile)[];
</script>

<div class="attachments">
    {#each attachments as attachment}
        <Attachment {attachment} />
    {/each}
</div>

<style>
    .attachments {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 5px;
    }
</style>
