<script lang="ts">
    import type { Peer } from "../lib/voice";
    import { voiceChannelId, voicePeers } from "../stores/voice_stores";
    import VoiceMember from "./VoiceMember.svelte";

    export let name: string = 'Voice Channel';
    export let id: string;

    let all_peers = [];

    voicePeers.subscribe((v) => {
        if ($voiceChannelId !== id) return;
        all_peers = Object.values(v);
    })
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="channel" on:click={() => voiceChannelId.update((v) => id)}>
    <p class="channel-name">{name}</p>
    {#if $voiceChannelId === id}
        <div class="members">
            {#each all_peers as peer}
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
    }

    .channel:hover {
        background-color: #404249;
        color: #fff;
    }
</style>
