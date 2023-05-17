<script lang="ts">
    import {
        voiceChannelTarget,
        voiceChannelCurrent,
        voiceState,
        voicePeers,
    } from "../../lib/stores";

    import { VoiceState, disconnectFromVoice } from "../../lib/voice";
    import { onMount } from "svelte";
    import VoiceLatencyIcon from "./VoiceLatencyIcon.svelte";
    import DisconnectIcon from "~icons/majesticons/phone-missed-call";
    import Tooltip from "../base/Tooltip.svelte";

    let statsInterval: number;
    let latencyMs: number = 0;

    $: me = [...$voicePeers.values()].find((p) => p.is_me);

    onMount(() => {
        statsInterval = setInterval(async () => {
            if (!me) return;
            
            let stats;
            try {
                stats = await me.producer.getStats();
            } catch (e) {
                clearInterval(statsInterval);
                return;
            }

            stats.forEach((report) => {
                if (report.type === "remote-inbound-rtp") {
                    if (report.roundTripTime) {
                        latencyMs = report.roundTripTime * 1000;
                    }
                }
            });
        }, 1000);
    });
</script>

<div class="voice-controls" class:divide={$voiceState != VoiceState.DISCONNECTED}>
    {#if $voiceState == VoiceState.DISCONNECTING}
        <div>
            <span class="status yellow">Disconnecting</span>
            <span class="channel-name">{$voiceChannelCurrent?.name}</span>
        </div>
    {:else if $voiceState == VoiceState.CONNECTING || $voiceState == VoiceState.GETTING_IDENTITY}
        <div>
            <span class="status yellow">RTC Connecting</span>
            <span class="channel-name">
                {$voiceChannelTarget?.name || $voiceChannelCurrent?.name} | {$voiceChannelTarget?.guild_name || $voiceChannelCurrent?.guild_name}
            </span>
        </div>
    {:else if $voiceState == VoiceState.CONNECTED}
        <div style="flex-grow: 1;">
            <div class="status green">
                <VoiceLatencyIcon latency={latencyMs} />
                <span>Connected</span>
            </div>
            <div class="channel-name">
                {$voiceChannelCurrent?.name} | {$voiceChannelCurrent?.guild_name}
            </div>
        </div>
        <Tooltip text="Leave Channel">
            <button class="disconnect" on:click={disconnectFromVoice}>
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
        display: flex;
        /* justify-content: center; */
    }

    .divide {
        padding-bottom: 12px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        margin-bottom: 16px;
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
