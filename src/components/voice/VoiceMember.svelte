<script lang="ts">
    import { onMount } from "svelte";
    import type { Peer } from "../../lib/voice";
    import type { Consumer } from "mediasoup-client/lib/Consumer";
    import VoiceMemberDuplicateTag from "./VoiceMemberDuplicateTag.svelte";

    export let peer: Peer;
    export let isDuplicate: boolean = false;

    let analyzer: AnalyserNode = null;
    let speaking: Boolean = false;
    let intervalHandle: number = null;

    function isSoundDetected() {
        const bufferLength = analyzer.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyzer.getByteFrequencyData(dataArray);

        const threshold = 100;
        let soundDetected = false;

        for (let i = 0; i < bufferLength; i++) {
            if (dataArray[i] > threshold) {
                soundDetected = true;
                break;
            }
        }

        return soundDetected;
    }

    $: consumer = peer.consumers.values().next().value;
    $: if (consumer || peer.producer) {
        if (intervalHandle != null) {
            clearInterval(intervalHandle);
            intervalHandle = null;
        }

        const stream = new MediaStream();

        if (peer.producer) {
            stream.addTrack(peer.producer.track);
        } else if (consumer) {
            stream.addTrack(consumer.track);
        }

        const audioContext = new AudioContext();
        const mediaStreamSource = audioContext.createMediaStreamSource(stream);
        analyzer = audioContext.createAnalyser();
        analyzer.fftSize = 1024;
        analyzer.smoothingTimeConstant = 0;
        mediaStreamSource.connect(analyzer);

        intervalHandle = setInterval(() => {
            speaking = isSoundDetected();
        }, 100) as any;
    }
</script>

<div class="voice-member">
    <!-- svelte-ignore a11y-missing-attribute -->
    <img class="avatar" src={peer.user.avatar} class:lit={speaking} />
    <div class="name">
        <span>{peer.user.username.split("#")[0]}</span>
        {#if isDuplicate}
            <VoiceMemberDuplicateTag is_me={peer.is_me} text={peer.identity.slice(0, 3)} />
        {/if}
    </div>
</div>

<style>
    .voice-member {
        display: flex;
        align-items: center;
        padding: 4px 8px;
        gap: 10px;
    }
    .avatar {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: gray;
    }

    .lit {
        /* border with gap */
        outline: 4px solid #00b576;
    }

    .name {
        line-height: 1rem;
        display: flex;
        gap: 8px;
    }
</style>
