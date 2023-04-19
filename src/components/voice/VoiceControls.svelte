<script lang="ts">
    import {
        voiceChannelTarget,
        voiceChannelCurrent,
        voiceState,
        voicePeers,
    } from "../../lib/stores";

    import { VoiceState } from "../../lib/voice";
    import { onMount } from "svelte";
    import VoiceLatencyIcon from "./VoiceLatencyIcon.svelte";
    import DisconnectIcon from "~icons/majesticons/phone-missed-call";
    import Tooltip from "../Tooltip.svelte";

    let statsInterval: number;
    let latencyMs: number = 0;

    $: me = [...$voicePeers.values()].find((p) => p.is_me);

    onMount(() => {
        statsInterval = setInterval(async () => {
            if (!me) return;
            let stats = await me.producer.getStats();

            stats.forEach((report) => {
                if (report.type === "remote-inbound-rtp") {
                    if (report.roundTripTime) {
                        latencyMs = report.roundTripTime * 1000;
                    }
                }
            });
        }, 1000);
    });

    function leave() {
        voiceChannelTarget.update((v) => null);
    }
</script>

<div class="voice-controls">
    {#if $voiceState == VoiceState.DISCONNECTING}
        <div>
            <span class="status yellow">Disconnecting</span>
            <span class="channel-name">{$voiceChannelCurrent?.name}</span>
        </div>
    {:else if $voiceState == VoiceState.CONNECTING || $voiceState == VoiceState.GETTING_IDENTITY}
        <div>
            <span class="status yellow">RTC Connecting</span>
            <span class="channel-name">
                {$voiceChannelTarget?.name || $voiceChannelCurrent?.name}
            </span>
        </div>
    {:else if $voiceState == VoiceState.CONNECTED}
        <div style="flex-grow: 1;">
            <div class="status green">
                <VoiceLatencyIcon latency={latencyMs} />
                <span>Connected</span>
            </div>
            <div class="channel-name">
                {$voiceChannelCurrent?.name}
            </div>
        </div>
        <Tooltip text="Leave Channel">
            <button class="disconnect" on:click={leave}>
                <div class="dc-icon">
                    <DisconnectIcon />
                </div>
            </button>
        </Tooltip>
    {:else if $voiceState == VoiceState.PERMISSION_REQUEST}
        <div>
            <span class="status yellow">Permission Request</span>
            <span class="channel-name">
                {$voiceChannelTarget?.name || $voiceChannelCurrent?.name}
            </span>
        </div>
    {/if}
</div>

<style>
    .voice-controls {
        background-color: var(--bg-1);
        box-shadow: 2px -2px 3px 0 rgba(0, 0, 0, 0.2);

        box-sizing: border-box;
        padding: 12px 16px;

        display: flex;
        /* justify-content: center; */
    }
    .disconnect {
        padding: 8px;
        width: 40px;
        height: 40px;
        background: var(--bg1);

        box-sizing: border-box;
        border: 4px solid var(--bg-0);
        border-radius: 10px;

        color: var(--gray);
        line-height: 0;
        cursor: pointer;
    }

    .dc-icon {
        transform: scale(125%);
    }

    .status {
        font-weight: bold;
        display: flex;
        gap: 5px;
        align-items: center;
        user-select: none;
    }

    .green {
        color: var(--green);
    }
    .yellow {
        color: var(--yellow);
    }

    .channel-name {
        font-size: 0.8em;
        color: var(--gray);
    }
</style>
