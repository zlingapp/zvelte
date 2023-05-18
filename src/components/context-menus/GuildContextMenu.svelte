<script lang="ts">
    export let onCopyId: () => void;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="cm-action" on:click={onCopyId}>
    Copy ID
</div>

<style>
    @import "../base/ContextMenu.css";
</style>