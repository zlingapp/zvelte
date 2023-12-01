<script lang="ts">
    export let onCopyId: () => void;
    export let onMarkRead: () => void;
</script>

<div class="cm-action" on:click={onCopyId}>Copy ID</div>
<div class="cm-action" on:click={onMarkRead}>Mark as Read</div>

<!-- svelte-ignore css-unused-selector -->
<style>
    @import "../base/ContextMenu.css";
</style>
