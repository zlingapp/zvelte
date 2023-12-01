<script lang="ts">
    export let onMarkAsRead: () => void;
    export let onCopyLink: () => void;
    export let onEditChannel: () => void;
    export let onDuplicateChannel: () => void;
    export let onDeleteChannel: () => void;
    export let onCopyId: () => void;
</script>

<div class="cm-action cm-unimportant" on:click={onMarkAsRead}>Mark As Read</div>
<div class="cm-action" on:click={onCopyLink}>Copy Link</div>
<div class="cm-divider" />
<div class="cm-action" on:click={onEditChannel}>Edit Channel</div>
<div class="cm-action" on:click={onDuplicateChannel}>Duplicate Channel</div>
<div class="cm-action cm-dangerous" on:click={onDeleteChannel}>
    Delete Channel
</div>
<div class="cm-divider" />
<div class="cm-action cm-unimportant" on:click={onCopyId}>Copy Channel ID</div>

<style>
    @import "../base/ContextMenu.css";
</style>
