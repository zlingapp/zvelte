<script lang="ts">
    import VoiceChannel from "../components/voice/VoiceChannel.svelte";
    import VoiceControls from "../components/voice/VoiceControls.svelte";
    import VoiceManager from "../components/voice/VoiceManager.svelte";

    import { onMount } from "svelte";
    import {
        apiToken,
        currentChannel,
        currentGuild,
        eventSocket,
        localUser,
    } from "../lib/stores";
    import { navigate } from "svelte-routing";
    import LocalUserControls from "../components/LocalUserControls.svelte";
    import { ensureLoggedIn } from "../lib/auth";
    import ServerList from "../components/ServerList.svelte";
    import ChannelContent from "../components/ChannelContent.svelte";
    import IconParkOutlineSleepOne from "~icons/icon-park-outline/sleep-one";
    import ChannelList from "../components/ChannelList.svelte";

    function connectWebSocket() {
        if ($eventSocket && $eventSocket?.readyState !== WebSocket.CLOSED) {
            return;
        }

        let ws_url = new URL(
            `ws${location.protocol === "https:" ? "s" : ""}://${
                location.host
            }/api/events/ws/?auth=${$apiToken}`,
            location.href
        );

        $eventSocket = new WebSocket(ws_url);

        // the moment the socket opens, begin the initialization process
        $eventSocket.onopen = async () => {};

        // whenever the socket closes, we need to disconnect
        $eventSocket.onclose = async () => {
            clearInterval(heartbeat_handle);
            connectWebSocket();
        };

        // in browsers, websockets disconnect after 30 seconds of inactivity
        // which means we need to send a message periodically to keep the connection alive
        let heartbeat_handle = setInterval(
            () => $eventSocket.send("heartbeat"),
            5000
        );
    }

    onMount(async () => {
        if (await ensureLoggedIn()) {
            connectWebSocket();
        }
    });

    $: currentChannelInCurrentGuild = $currentGuild?.channels?.find(
        (c) => c.id === $currentChannel?.id
    );
</script>

{#if $localUser}
    <main>
        <VoiceManager />
        <ServerList />

        <div class="sidebar">
            {#if $currentGuild}
                <div class="server-head">
                    <p class="server-name">{$currentGuild.name}</p>
                </div>
            {/if}

            <div class="server-channels">
                {#if $currentGuild}
                    <ChannelList />
                {/if}

                <!-- <VoiceChannel id="chan_a" name="Channel A" />
                        <VoiceChannel id="chan_b" name="Channel B" />
                        <VoiceChannel id="chan_c" name="Channel C" /> -->
            </div>

            <div class="bottom-user-drawer">
                <VoiceControls />
                <LocalUserControls />
            </div>
        </div>

        <section class="content">
            {#if $currentChannel && currentChannelInCurrentGuild}
                <ChannelContent
                    channel={$currentChannel}
                    guild_id={$currentGuild.id}
                >
                    <div slot="sidebar" class="sidebar">
                        <div class="user-list" />
                    </div>
                </ChannelContent>
            {:else}
                <div class="lonely">
                    <div class="lonely-icon"><IconParkOutlineSleepOne /></div>
                    <div>*crickets*</div>
                </div>
            {/if}
        </section>
    </main>
{/if}

<style>
    main {
        display: flex;
        height: 100svh;
        width: 100vw;
    }
    .sidebar {
        width: 240px;
        background-color: var(--bg-1);
        display: flex;
        flex-direction: column;
    }
    .bottom-user-drawer {
        /* background-color: var(--bg-1); */
        background-color: #232428;
        box-shadow: 0px -2px 3px 0 rgba(0, 0, 0, 0.2);

        box-sizing: border-box;
        padding: 12px 16px;
    }
    .server-head {
        height: 48px;
        background-color: var(--bg-1);
        box-shadow: 0px 2px 3px 0 rgba(0, 0, 0, 0.3);

        box-sizing: border-box;
        padding: 12px 16px;

        display: flex;
        align-items: center;
    }
    .server-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .content {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .server-channels {
        position: relative;
        flex-grow: 1;
    }

    .lonely {
        text-align: center;
        font-weight: 600;
        font-size: 32px;
        color: rgba(255, 255, 255, 0.08);
        user-select: none;
    }
    .lonely-icon {
        line-height: 0;
        font-size: 128px;
    }
</style>
