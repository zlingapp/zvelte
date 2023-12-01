<script lang="ts">
    import TopicConsumer from "src/components/TopicConsumer.svelte";
    import CreateServerIcon from "src/components/serverlist/AddGuildIcon.svelte";
    import DmIcon from "src/components/serverlist/DmIcon.svelte";
    import GuildIcon from "src/components/serverlist/GuildIcon.svelte";
    import HomeIcon from "src/components/serverlist/HomeIcon.svelte";
    import { authFetch } from "src/lib/auth";
    import type { PublicUserInfo } from "src/lib/channel";
    import type { UnreadDM } from "src/lib/friends";
    import type { EventSocketMessage } from "src/lib/socket";
    import {
        dmChannelOpen,
        guilds,
        recentDMs,
        unreadDMs
    } from "src/lib/stores";
    import type { UploadedFile } from "src/lib/upload";
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";

    async function fetchGuilds() {
        let resp = await authFetch("/guilds");
        if (resp.status != 200) {
            return;
        }
        $guilds = await resp.json();
    }

    onMount(async () => {
        await fetchGuilds();
    });

    async function createServer(name: string, iconFile?: UploadedFile) {
        // todo: validate createServerName

        let reply = await authFetch("/guilds", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                icon: iconFile?.url,
            }),
        });

        await fetchGuilds();
    }

    async function joinServer(id: string) {
        if (!id) {
            return;
        }

        const resp = await authFetch(`/guilds/${id}/join`);

        alert(resp.status);

        await fetchGuilds();
    }

    async function onRelevantEvent(msg: EventSocketMessage) {
        if (msg.event.type != "message") {
            return;
        }

        const userId = msg.topic.id;

        recentDMs.update((arr: PublicUserInfo[]) => {
            const index = arr.findIndex((u) => u.id === userId);
            if (index !== -1) {
                const [el] = arr.splice(index, 1);
                arr.unshift(el);
            }
            return arr;
        });

        if ($dmChannelOpen?.id == userId) {
            return;
        }

        unreadDMs.update((obj: Record<string, UnreadDM>) => {
            const author = (msg.event as any).author;

            if (author.id != userId) {
                // rare case where we get an event about ourselves
                return obj;
            }

            const entry = obj[userId];
            const unread = entry == null ? 0 : entry.count;

            obj[userId] = {
                user: author,
                count: unread + 1,
            } as UnreadDM;

            return obj;
        });
    }

    $: unreadDmsList = Object.entries($unreadDMs);
</script>

<TopicConsumer
    onReconnect={() => {}}
    eventFilter={(msg) => msg.topic.type == "dm_channel"}
    {onRelevantEvent}
/>

<div class="server-list outer">
    <HomeIcon />

    <div class="divider" />

    {#if unreadDmsList.length > 0}
        <div class="server-list" transition:fly={{ duration: 250 }}>
            {#each unreadDmsList as [id, unread] (id)}
                <DmIcon {id} user={unread.user} unread={unread.count} />
            {/each}
        </div>
        <div class="divider" />
    {/if}

    {#each $guilds as guild}
        <GuildIcon {guild} />
    {/each}

    <CreateServerIcon {createServer} {joinServer} />
</div>

<style>
    .server-list {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
    }

    .server-list.outer {
        min-width: 72px;
        background-color: var(--bg-2);
        padding-block: 16px;
    }

    .divider {
        padding: 0;
        margin: 0;
        width: 32px;
        height: 2px;
        background-color: var(--bg-0);
    }
</style>
