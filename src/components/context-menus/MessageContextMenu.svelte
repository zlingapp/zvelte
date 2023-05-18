<script lang="ts">
    export let onMarkAsRead: () => void;
    export let onCopyLink: () => void;
    export let onEdit: () => void;
    export let onDelete: () => void;
    export let onCopyId: () => void;
    export let onCopyText: () => void;
    export let onReply: () => void;
    export let onPin: () => void;

    export let editAllowed: boolean;
    export let modAllowed: boolean;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="cm-action" on:click={onReply}>Reply</div>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="cm-action" on:click={onCopyText}>Copy Message Text</div>
<div class="cm-divider" />
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="cm-action unimportant" on:click={onMarkAsRead}>Mark As Read</div>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="cm-action" on:click={onCopyLink}>Copy Message Link</div>

{#if editAllowed || modAllowed}
    <div class="cm-divider" />
{/if}
{#if modAllowed}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="cm-action" on:click={onPin}>Pin Message</div>
{/if}
{#if editAllowed}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="cm-action" on:click={onEdit}>Edit Message</div>
{/if}
{#if modAllowed}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="cm-action dangerous" on:click={onDelete}>Delete Message</div>
{/if}
<div class="cm-divider" />
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="cm-action unimportant" on:click={onCopyId}>Copy Message ID</div>

<style>
    @import "../base/ContextMenu.css";
</style>
