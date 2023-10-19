<script lang="ts">
    export let onExport: () => void;
    export let onDelete: () => void;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="cm-action" on:click={onExport}>
    Export
</div>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="cm-action" on:click={onDelete}>
    <span style="color: var(--red)">Delete</span>
</div>

<style>
    @import "../base/ContextMenu.css";
</style>