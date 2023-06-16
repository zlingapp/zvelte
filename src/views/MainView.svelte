<script lang="ts">
    import VoiceControls from "../components/voice/VoiceControls.svelte";
    import VoiceManager from "../components/voice/VoiceManager.svelte";

    import {
        currentChannel,
        currentGuild,
        localUser,
        userSettingsOpen,
    } from "../lib/stores";
    
    import LocalUserControls from "../components/LocalUserControls.svelte";
    import ServerList from "../components/ServerList.svelte";
    import MessageList from "../components/text/MessageList.svelte";
    import IconParkOutlineSleepOne from "~icons/icon-park-outline/sleep-one";
    import ChannelList from "../components/ChannelList.svelte";
    import ErrorModal from "../components/modals/ErrorModal.svelte";
    import EventSocketManager from "../components/EventSocketManager.svelte";
    import { onMount } from "svelte";
    import { ensureHaveValidTokens, ensureLoggedIn } from "../lib/auth";
    import LoadingScreen from "../components/LoadingScreen.svelte";
    import UserSettings from "../components/settings/UserSettings.svelte";

    let socketDisconnected;

    onMount(async () => {
        await ensureLoggedIn();
    })
</script>

<ErrorModal />
<EventSocketManager bind:socketDisconnected />
{#if socketDisconnected}
    <LoadingScreen />
{/if}
{#if $localUser}
    {#if $userSettingsOpen}
        <UserSettings />
    {/if}
    <div class="wrapper" on:contextmenu|preventDefault>
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
                </div>

                <div class="bottom-user-drawer">
                    <VoiceControls />
                    <LocalUserControls />
                </div>
            </div>

            <section class="content">
                {#if $currentChannel}
                    <MessageList
                        channel={$currentChannel}
                        guild_id={$currentGuild.id}
                    >
                        <div slot="sidebar" class="sidebar">
                            <div class="user-list" />
                        </div>
                    </MessageList>
                {:else}
                    <div class="lonely">
                        <div class="lonely-icon">
                            <IconParkOutlineSleepOne />
                        </div>
                        <div>*crickets*</div>
                    </div>
                {/if}
            </section>
        </main>
    </div>
{/if}

<style>
    .wrapper {
        display: flex;
        flex-direction: column;
        height: 100svh;
        width: 100vw;
        overflow: hidden;
    }

    main {
        display: flex;
        flex-grow: 1;
    }
    .sidebar {
        width: 240px;
        min-width: 240px;
        max-width: 240px;
        height: 100%;
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
