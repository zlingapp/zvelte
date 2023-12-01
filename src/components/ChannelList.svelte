<script lang="ts">
    import { onMount } from "svelte";
    import type { Guild } from "../lib/guild";
    import { currentChannel, currentGuild, guilds } from "../lib/stores";
    import SvgSpinnersRingResize from "~icons/svg-spinners/ring-resize";
    import type { Channel, TextChannel } from "../lib/channel";
    import UiTextChannel from "./text/UiTextChannel.svelte";
    import Button from "./base/Button.svelte";
    import { text } from "svelte/internal";
    import MaterialSymbolsAdd from "~icons/material-symbols/add";
    import VoiceChannel from "./voice/VoiceChannel.svelte";
    import { authFetch } from "../lib/auth";
    import {
        type EventSocketMessage,
        eventSocketSubscribe,
        eventSocketUnsubscribe,
    } from "../lib/socket";
    import TopicConsumer from "./TopicConsumer.svelte";
    import ContextMenu from "./base/ContextMenu.svelte";
    import ChannelListContextMenu from "./context-menus/ChannelListContextMenu.svelte";

    // guild id of the last guild we subscribed to
    let previousGuildId = null;

    async function getChannelList(guild: Guild) {
        let resp = await authFetch(`/guilds/${guild.id}/channels`);
        // the line above took a considerable amount of time in which the user
        // could have clicked on another guild, so check that the current guild
        // is STILL the one we're trying to get the channels for
        if ($currentGuild?.id != guild.id) {
            return;
        }

        let channels: Channel[] = await resp.json();
        currentGuild.update((g) => ({ ...g, channels }));

        // cache results in the guilds list for when we switch back next 
        guilds.update((guilds) =>
            guilds.map((g) => {
                if (g.id == guild.id) {
                    g.channels = channels;
                }
                return g;
            })
        );
    }

    function autoSelectChannel(guild: Guild) {
        const currentChannelInCurrentGuild = guild.channels?.find(
            (c) => c.id === $currentChannel?.id
        );

        if (currentChannelInCurrentGuild != null) {
            return;
        }

        if (guild.channels?.length > 0) {
            // auto-open the first text channel or if there aren't any text
            // channels, set to null
            const firstTextChannel = guild.channels.find(
                (c) => c.type == "text"
            ) as TextChannel;

            $currentChannel = firstTextChannel || null;
        } else {
            // if there are no channels, set to null
            $currentChannel = null;
        }
    }

    async function subscribeToTopics(guild: Guild) {
        if (previousGuildId != null) {
            // transitioning from one guild to another, so unsubscribe from the old one
            await eventSocketUnsubscribe([
                { type: "guild", id: previousGuildId },
            ]);
        }

        // subscribe to new guild events
        await eventSocketSubscribe([{ type: "guild", id: guild.id }]);

        previousGuildId = guild.id;
    }

    onMount(async () => {
        currentGuild.subscribe(async (guild) => {
            if (guild == null) {
                return;
            }

            if (guild.id == previousGuildId) {
                return;
            }

            await subscribeToTopics(guild);

            if (guild.channels == null) {
                // get the channel list right now
                await getChannelList(guild);
            } else {
                // we have cache, so get the channel list a little later
                getChannelList(guild);
            }

            autoSelectChannel(guild);
        });
    });

    async function createChannel(type: "voice" | "text") {
        let name = prompt("Channel name?");
        if (name == null) {
            return;
        }

        let resp = await authFetch(`/guilds/${$currentGuild.id}/channels`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                type,
            }),
        });

        if (!resp.ok) {
            alert(`Failed to create channel: ${await resp.text()}`);
            return;
        }
    }

    async function onRelevantEvent(esm: EventSocketMessage) {
        if (esm.event.type == "channelListUpdate") {
            await getChannelList($currentGuild);
        }
    }

    async function onCreateTextChannel() {
        await createChannel("text");
    }

    async function onCreateVoiceChannel() {
        await createChannel("voice");
    }
</script>

<TopicConsumer
    {onRelevantEvent}
    eventFilter={(esm) =>
        esm.topic.type == "guild" && esm.topic.id == $currentGuild.id}
    onReconnect={async () => {
        const guild = $currentGuild;
        
        if (guild == null) {
            // if somehow we *just* switched from guilds to dms, then we don't need to resubscribe
            return;
        }

        await subscribeToTopics(guild);
        await getChannelList(guild);
    }}
/>
<ContextMenu>
    <div class="channel-list">
        {#if $currentGuild.channels == null}
            <!-- loading -->
            <div class="status"><SvgSpinnersRingResize /></div>
        {:else if $currentGuild.channels.length > 0}
            <!-- show channel list -->
            {#each $currentGuild.channels as channel}
                {#if channel.type == "text"}
                    <UiTextChannel {channel} />
                {:else if channel.type == "voice"}
                    <VoiceChannel
                        name={channel.name}
                        id={channel.id}
                        guild_name={$currentGuild.name}
                    />
                {/if}
            {/each}
        {:else}
            <!-- nothing in the list -->
            <div class="status">No Visible Channels</div>
        {/if}
    </div>
    <ChannelListContextMenu
        {onCreateTextChannel}
        {onCreateVoiceChannel}
        slot="menu"
    />
</ContextMenu>

<style>
    .channel-list {
        position: absolute;
        padding: 8px 12px;
        display: flex;
        flex-direction: column;

        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }

    .status {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50px;

        color: var(--gray);
        user-select: none;
    }
</style>
