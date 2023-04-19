<script lang="ts">
    import { onMount } from "svelte";
    import type { Peer } from "../../lib/voice";
    import type { Consumer } from "mediasoup-client/lib/Consumer";

    export let peer: Peer;

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
        }, 100);
    }
</script>

<div class="voice-member">
    <div class="avatar" class:lit={speaking} />
    <p class="name">{peer.identity.slice(0,8)}</p>
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
        margin-right: 5px;
    }

    .lit {
        /* border with gap */
        outline: 4px solid #00b576;
        outline-offset: 2px;
    }
</style>
