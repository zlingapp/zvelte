<script lang="ts">
    import VoiceChannel from "../components/voice/VoiceChannel.svelte";
    import VoiceControls from "../components/voice/VoiceControls.svelte";
    import VoiceManager from "../components/voice/VoiceManager.svelte";

    import { onMount } from "svelte";
    import { localUser } from "../lib/stores";
    import { navigate } from "svelte-routing";
    
    onMount(() => {
        if ($localUser == null) {
            navigate("/login");
        }
    });
</script>

<main>
    <VoiceManager />
    <div class="server-list" />

    <div class="sidebar">
        <div class="server-head">
            <p class="server-name">Server Name</p>
        </div>

        <div class="server-channels">
            <VoiceChannel id="chan_a" name="Channel A" />
            <VoiceChannel id="chan_b" name="Channel B" />
            <VoiceChannel id="chan_c" name="Channel C" />
        </div>

        <VoiceControls />
    </div>

    <div class="content">
        <div class="head">
            <div class="channel-title" />
            <div class="actions" />
        </div>
        <div class="body">
            <div class="message-pane" />
            <!-- <div class="sidebar">
                <div class="user-list" />
            </div> -->
        </div>
    </div>
</main>

<style>
    main {
        display: flex;
        height: 100svh;
        width: 100vw;
    }

    .server-list {
        width: 72px;
        background-color: var(--bg-3);
    }
    .sidebar {
        width: 240px;
        background-color: var(--bg-1);
        display: flex;
        flex-direction: column;
    }
    .server-head {
        height: 48px;
        background-color: var(--bg-1);
        box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

        box-sizing: border-box;
        padding: 12px 16px;

        display: flex;
        align-items: center;
    }
    .content {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }
    .head {
        height: 48px;
        background-color: var(--bg-1);
        box-shadow: 0px 2px 3px 0 rgba(0, 0, 0, 0.3);
        z-index: 100;
        background-color: var(--bg-0);
    }
    .body {
        flex-grow: 1;
        display: flex;
        height: 100px;
    }
    .message-pane {
        flex-grow: 1;
        background-color: var(--bg-0);
    }
    .server-channels {
        padding: 8px 12px;
        flex-grow: 1;
    }
</style>