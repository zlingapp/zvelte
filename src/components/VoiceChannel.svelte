<script>
    import VoiceMember from "./VoiceMember.svelte";

    export let onclick;
    export let members;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="channel" on:click={onclick}>
    <p class="channel-name">Voice Channel</p>
    <div class="members">
        {#each members as member}
            <VoiceMember name={member} />
        {/each}
    </div>
</div>

<style>
    .channel {
        color: #888b8f;
        padding: 6px 0;
        cursor: pointer;
        border-radius: 6px;
        user-select: none;
    }

    .channel-name {
        padding-left: 8px;
    }

    .channel:hover {
        background-color: #404249;
        color: #fff;
    }
</style>
