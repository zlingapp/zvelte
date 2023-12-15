<script lang="ts">
    export let onCopyId: () => void;
</script>

<div class="cm-action" on:click={onCopyId}>Copy ID</div>

<!-- svelte-ignore css-unused-selector -->
<style>
    @import "../base/ContextMenu.css";
</style>
