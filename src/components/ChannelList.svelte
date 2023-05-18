<script lang="ts">
    import { onMount } from "svelte";
    import type { Guild } from "../lib/guild";
    import { currentChannel, currentGuild } from "../lib/stores";
    import SvgSpinnersBarsRotateFade from "~icons/svg-spinners/bars-rotate-fade";
    import type { Channel, TextChannel } from "../lib/channel";
    import UiTextChannel from "./text/UiTextChannel.svelte";
    import Button from "./base/Button.svelte";
    import { text } from "svelte/internal";
    import MaterialSymbolsAdd from "~icons/material-symbols/add";
    import VoiceChannel from "./voice/VoiceChannel.svelte";
    import { auth_fetch } from "../lib/auth";
    import { eventSocketSend, type EventSocketMessage } from "../lib/socket";
    import TopicConsumer from "./TopicConsumer.svelte";

    // guild id of the last guild we subscribed to
    let previousGuildId = null;

    async function get_channel_list() {
        let resp = await auth_fetch(`/api/guilds/${$currentGuild.id}/channels`);
        let channels: Channel[] = await resp.json();
        currentGuild.update((g) => ({ ...g, channels }));

        const currentChannelInCurrentGuild = $currentGuild?.channels?.find(
            (c) => c.id === $currentChannel?.id
        );

        if (channels?.length > 0 && currentChannelInCurrentGuild == null) {
            // auto-open the first text channel or if there aren't any text channels, set to null
            let auto =
                (channels.find((c) => c.type == "text") as TextChannel) || null;
            $currentChannel = auto;
        } else {
            // if there are no channels, set to null
            $currentChannel = null;
        }
    }

    async function subscribeToTopics(guild: Guild) {
        // subscribe to new channel
        let msg: any = {
            sub: ["guild:" + guild?.id],
        };
        if (previousGuildId != null && previousGuildId !== guild.id) {
            // transitioning from one channel to another, so unsubscribe from the old one
            msg = { ...msg, unsub: ["guild:" + previousGuildId] };
        }

        await eventSocketSend(JSON.stringify(msg));
        previousGuildId = guild.id;
    }

    onMount(async () => {
        currentGuild.subscribe(async (guild) => {
            if (guild.channels != null) {
                return;
            }

            await subscribeToTopics(guild);
            await get_channel_list();
        });
    });

    async function create_channel(type: "voice" | "text") {
        let name = prompt("Channel name?");
        if (name == null) {
            return;
        }

        let resp = await auth_fetch(
            `/api/guilds/${$currentGuild.id}/channels`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    type,
                }),
            }
        );

        if (!resp.ok) {
            alert(`Failed to create channel: ${await resp.text()}`);
            return;
        }
    }

    async function onRelevantEvent(esm: EventSocketMessage) {
        if (esm.event.type == "channel_list_update") {
            await get_channel_list();
        }
    }
</script>

<TopicConsumer
    {onRelevantEvent}
    eventFilter={(esm) =>
        esm.topic.type == "guild" && esm.topic.id == $currentGuild.id}
    onReconnect={async () => {
        await subscribeToTopics($currentGuild);
        await get_channel_list();
    }}
/>
<div class="channel-list">
    {#if $currentGuild.channels == null}
        <!-- loading -->
        <div class="status"><SvgSpinnersBarsRotateFade /></div>
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

    <div style="flex-grow: 1;" />

    <Button
        onClick={async () => {
            await create_channel("text");
        }}>Create Text Channel</Button
    >
    <Button
        onClick={async () => {
            await create_channel("voice");
        }}>Create Voice Channel</Button
    >
</div>

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
