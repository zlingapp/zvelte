<script lang="ts">
    export let onCopyId: () => void;
    export let onMarkRead: () => void;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="cm-action" on:click={onCopyId}>
    Copy ID
</div>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="cm-action" on:click={onMarkRead}>
    Mark as Read
</div>

<style>
    @import "../base/ContextMenu.css";
</style>