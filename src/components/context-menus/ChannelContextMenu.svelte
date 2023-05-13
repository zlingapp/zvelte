<script lang="ts">
    export let onMarkAsRead: () => void;
    export let onCopyLink: () => void;
    export let onEditChannel: () => void;
    export let onDuplicateChannel: () => void;
    export let onDeleteChannel: () => void;
    export let onCopyId: () => void;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="action unimportant" on:click={onMarkAsRead}>
    Mark As Read
</div>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="action" on:click={onCopyLink}>
    Copy Link
</div>
<div class="divider" /> 
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="action" on:click={onEditChannel}>
    Edit Channel
</div>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="action" on:click={onDuplicateChannel}>
    Duplicate Channel
</div>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="action dangerous" on:click={onDeleteChannel}>
    Delete Channel
</div>
<div class="divider" /> 
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="action unimportant" on:click={onCopyId}>
    Copy Channel ID
</div>

<style>
    @import "./base/context-menu.css";
</style>