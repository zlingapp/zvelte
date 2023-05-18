<script lang="ts">
    export let onMarkAsRead: () => void;
    export let onCopyLink: () => void;
    export let onEditChannel: () => void;
    export let onDuplicateChannel: () => void;
    export let onDeleteChannel: () => void;
    export let onCopyId: () => void;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="cm-action unimportant" on:click={onMarkAsRead}>
    Mark As Read
</div>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="cm-action" on:click={onCopyLink}>
    Copy Link
</div>
<div class="cm-divider" /> 
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="cm-action" on:click={onEditChannel}>
    Edit Channel
</div>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="cm-action" on:click={onDuplicateChannel}>
    Duplicate Channel
</div>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="cm-action dangerous" on:click={onDeleteChannel}>
    Delete Channel
</div>
<div class="cm-divider" /> 
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="cm-action unimportant" on:click={onCopyId}>
    Copy Channel ID
</div>

<style>
    @import "../base/ContextMenu.css";
</style>