<script lang="ts">
    import { onMount } from "svelte";
    import type { Guild } from "../lib/guild";
    import { currentChannel, currentGuild } from "../lib/stores";
    import SvgSpinnersBarsRotateFade from "~icons/svg-spinners/bars-rotate-fade";
    import type { Channel, TextChannel } from "../lib/channel";
    import UiTextChannel from "./text/UiTextChannel.svelte";

    async function get_channel_list() {
        let resp = await fetch(
            `/api/channels/list?` +
                new URLSearchParams({ id: $currentGuild.id }).toString()
        );
        let channels: Channel[] = await resp.json();
        currentGuild.update((g) => ({ ...g, channels }));

        if (channels?.length > 0 && $currentChannel == null) {
            // auto-open the first channel or if there aren't any text channels, set to null
            currentChannel.set(
                (channels.find((c) => c.type == "text") as TextChannel) || null
            );
        }
    }

    onMount(async () => {
        currentGuild.subscribe(async (g) => {
            if (g.channels != null) {
                return;
            }

            await get_channel_list();
        });

        await get_channel_list();
    });

    function switch_channel(channel: Channel) {
        currentChannel.set(channel as TextChannel);
    }
</script>

<div class="channel-list">
    {#if $currentGuild.channels == null}
        <!-- loading -->
        <div class="status"><SvgSpinnersBarsRotateFade /></div>
    {:else if $currentGuild.channels.length > 0}
        <!-- show channel list -->
        {#each $currentGuild.channels as channel}
            <UiTextChannel
                name={channel.name}
                onClick={() => switch_channel(channel)}
            />
        {/each}
    {:else}
        <!-- nothing in the list -->
        <div class="status">No Visible Channels</div>
    {/if}
</div>

<style>
    .channel-list {
        padding: 8px 12px;
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
