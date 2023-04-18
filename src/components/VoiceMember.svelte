<script lang="ts">
    import { onMount } from "svelte";
    import type { Peer } from "../lib/voice";
    import type { Consumer } from "mediasoup-client/lib/Consumer";

    export let peer: Peer;

    let analyzer: AnalyserNode = null;
    let speaking: Boolean = false;

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

    onMount(() => {
        let consumer: Consumer = peer.consumers.values().next().value; // todo: make this fancier

        const stream = new MediaStream();
        stream.addTrack(consumer.track);

        const audioContext = new AudioContext();
        const mediaStreamSource = audioContext.createMediaStreamSource(stream);
        analyzer = audioContext.createAnalyser();
        analyzer.fftSize = 1024;
        analyzer.smoothingTimeConstant = 0;
        mediaStreamSource.connect(analyzer);

        setInterval(() => {
            speaking = isSoundDetected();
        }, 100);
    });
</script>

<div class="voice-member">
    <div class="avatar" class:lit={speaking} />
    <pre class="name">{peer.identity} {#if peer.is_me} (You) {/if}</pre>
</div>

<style>
    .voice-member {
        display: flex;
        align-items: center;
        padding: 4px 8px;
        gap: 8px;
    }
    .avatar {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: gray;
    }

    .lit {
        background-color: #00b576;
    }
</style>
