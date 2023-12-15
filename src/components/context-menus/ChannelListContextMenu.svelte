<script lang="ts">
    export let onCreateTextChannel: () => void;
    export let onCreateVoiceChannel: () => void;
</script>

<div class="cm-action" on:click={onCreateTextChannel}>Create Text Channel</div>
<div class="cm-action" on:click={onCreateVoiceChannel}>
    Create Voice Channel
</div>

<!-- svelte-ignore css-unused-selector -->
<style>
    @import "../base/ContextMenu.css";
</style>
