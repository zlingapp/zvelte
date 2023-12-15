<script lang="ts">
    import Attachment from "src/components/text/message/attachments/Attachment.svelte";
    import type { PendingUpload, UploadedFile } from "src/lib/upload";

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
        margin-bottom: 5px;
        flex-direction: column;
        align-items: flex-start;
    }
</style>
