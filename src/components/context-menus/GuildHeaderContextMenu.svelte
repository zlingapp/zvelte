<script lang="ts">
    export let onCopyId: () => void;
    export let onCreateInvite: () => void;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="cm-action" on:click={onCopyId}>
    Copy ID
</div>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="cm-action" on:click={onCreateInvite}>
    Create Invite
</div>


<style>
    @import "../base/ContextMenu.css";
</style>