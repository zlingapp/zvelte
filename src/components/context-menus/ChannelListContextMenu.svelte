<script lang="ts">
    export let onCreateTextChannel: () => void;
    export let onCreateVoiceChannel: () => void;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="cm-action" on:click={onCreateTextChannel}>
    Create Text Channel
</div>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="cm-action" on:click={onCreateVoiceChannel}>
    Create Voice Channel
</div>

<style>
    @import "../base/ContextMenu.css";
</style>