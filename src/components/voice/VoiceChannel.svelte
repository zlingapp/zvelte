<script lang="ts">
    import VoiceMember from "src/components/voice/VoiceMember.svelte";
    import {
        voiceChannelCurrent,
        voiceChannelTarget,
        voicePeers,
    } from "src/lib/stores";
    import { isPeerDuplicate } from "src/lib/voice";
    import MajesticonsMicrophone from "~icons/majesticons/microphone";

    export let name: string = "Voice Channel";
    export let id: string;
    export let guild_name: string;

    function join() {
        if ($voiceChannelCurrent?.id === id) return;
        voiceChannelTarget.update((v) => ({ id, name, guild_name }));
    }

    $: peers = [...$voicePeers.values()];
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="channel" on:click={join}>
    <p class="channel-name"><MajesticonsMicrophone /><span>{name}</span></p>
    {#if $voiceChannelCurrent?.id === id && $voicePeers.size > 0}
        <div class="members">
            {#each peers as peer}
                <VoiceMember bind:peer isDuplicate={isPeerDuplicate(peer)} />
            {/each}
        </div>
    {/if}
</div>

<style>
    .channel {
        color: var(--channel-fg);
        padding: 6px 0;
        cursor: pointer;
        border-radius: 6px;
        user-select: none;
    }

    .channel-name {
        padding-left: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .channel:hover {
        background-color: var(--channel-hover-bg);
        color: var(--channel-hover-fg);
    }

    .members {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding-top: 10px;
        padding-inline: 10px;
    }
</style>
