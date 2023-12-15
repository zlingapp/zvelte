<script lang="ts">
    import VoiceControls from "src/components/voice/VoiceControls.svelte";
    import VoiceManager from "src/components/voice/VoiceManager.svelte";

    import {
        currentGuildChannel,
        currentGuild,
        localUser,
        isSettingsMenuOpen,
    } from "src/lib/stores";

    import ChannelList from "src/components/guild/channel-list/ChannelList.svelte";
    import EventSocketManager from "src/components/events/EventSocketManager.svelte";
    import LoadingScreen from "src/components/login/LoadingScreen.svelte";
    import LocalUserControls from "src/components/settings/LocalUserControls.svelte";
    import HomeContent from "src/components/home/HomeContent.svelte";
    import HomeSidebar from "src/components/home/HomeSidebar.svelte";
    import ErrorModal from "src/components/modals/ErrorModal.svelte";
    import ServerList from "src/components/serverlist/ServerList.svelte";
    import UserSettings from "src/components/settings/UserSettings.svelte";
    import MessageList from "src/components/text/MessageList.svelte";
    import MemberList from "src/components/guild/member-list/MemberList.svelte";
    import { ensureLoggedIn } from "src/lib/auth";
    import { onMount } from "svelte";

    let socketDisconnected: boolean;

    onMount(async () => {
        await ensureLoggedIn();
    });
</script>

<ErrorModal />
<EventSocketManager bind:socketDisconnected />
{#if socketDisconnected}
    <LoadingScreen />
{/if}
{#if $localUser}
    {#if $isSettingsMenuOpen}
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

                    <div class="sidebar-content">
                        <ChannelList />
                    </div>
                {:else}
                    <div class="sidebar-content">
                        <HomeSidebar />
                    </div>
                {/if}

                <div class="bottom-user-drawer">
                    <VoiceControls />
                    <LocalUserControls />
                </div>
            </div>

            <section class="content">
                {#if $currentGuildChannel}
                    <MessageList channel={$currentGuildChannel}>
                        <div slot="sidebar" class="sidebar">
                            <MemberList />
                        </div>
                    </MessageList>
                {:else}
                    <HomeContent />
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
        background-color: var(--user-drawer-bg);
        /* box-shadow: 0px -2px 3px 0 rgba(0, 0, 0, 0.2); */

        box-sizing: border-box;
        padding: 12px 16px;
    }
    .server-head {
        height: 48px;
        background-color: var(--bg-1);
        /* background-color: var(--user-drawer-bg); */
        /* box-shadow: 0px 2px 3px 0 rgba(0, 0, 0, 0.3); */
        font-weight: 500;

        box-sizing: border-box;
        padding: 12px 16px;
        margin-top: 8px;

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
    .sidebar-content {
        position: relative;
        flex-grow: 1;
    }
</style>
