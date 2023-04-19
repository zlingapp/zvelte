<script lang="ts">
    import { voiceChannelTarget, voiceChannelCurrent, voiceState } from "../stores/voice_stores";
    import { VoiceState } from "../lib/voice";

    export let voiceIdentity: string;
</script>

<div class="user-controls">
    {#if $voiceState == VoiceState.DISCONNECTED}
        <p>Disconnected</p>
    {:else if $voiceState == VoiceState.DISCONNECTING}
        <p>Leaving +{$voiceChannelCurrent}...</p>
    {:else if $voiceState == VoiceState.CONNECTING}
        <p>Connecting to #{$voiceChannelTarget}...</p>
    {:else if $voiceState == VoiceState.CONNECTED}
        <p>Connected</p>
        <button
            class="disconnect"
            on:click={() => voiceChannelTarget.update((v) => null)}
            >Disconnect</button
        >
    {/if}
    <!-- {#if voiceIdentity}
        <pre class="user-name">{voiceIdentity}</pre>
    {:else}
        <p class="user-name">No Identity</p>
    {/if} -->
</div>

<style>
    .user-controls {
        min-height: 64px;
        background-color: var(--bg-1);
        box-shadow: 2px -2px 3px 0 rgba(0, 0, 0, 0.2);

        box-sizing: border-box;
        padding: 12px 16px;

        display: flex;
        justify-content: center;
        flex-direction: column;
    }
    .disconnect {
        margin-top: 8px;
        padding: 10px 20px;
        font-family: inherit;
        font-weight: 600;
        color: inherit;
        background-color: #c94b44;
        border: none;
        border-radius: 6px;
        cursor: pointer;
    }
</style>
