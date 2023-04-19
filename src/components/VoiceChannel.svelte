<script lang="ts">
    import type { Peer } from "../lib/voice";
    import {
        voiceChannelTarget,
        voiceChannelCurrent,
        voicePeers,
    } from "../stores/voice_stores";
    import VoiceMember from "./VoiceMember.svelte";
    import MajesticonsMicrophone from '~icons/majesticons/microphone'

    export let name: string = "Voice Channel";
    export let id: string;

    function join() {
        if ($voiceChannelCurrent?.id === id) return;
        voiceChannelTarget.update((v) => ({ id, name }));
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="channel" on:click={join}>
    <p class="channel-name"><MajesticonsMicrophone /><span>{name}</span></p>
    {#if $voiceChannelCurrent?.id === id && $voicePeers.size > 0}
        <div class="members">
            {#each [...$voicePeers.values()] as peer}
                <VoiceMember bind:peer />
            {/each}
        </div>
    {/if}
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
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .channel:hover {
        background-color: #404249;
        color: #fff;
    }

    .members {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 10px;
    }
</style>
