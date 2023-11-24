<script lang="ts">
    import { onMount } from "svelte";
    import { authFetch } from "../../lib/auth";
    import {
        dmChannelOpen,
        guilds,
        recentDMs,
        showInErrorModal,
        unreadDMs,
    } from "../../lib/stores";
    import GuildIcon from "./GuildIcon.svelte";
    import CreateServerIcon from "./AddGuildIcon.svelte";
    import type { UploadedFile } from "../../lib/upload";
    import HomeIcon from "./HomeIcon.svelte";
    import TopicConsumer from "../TopicConsumer.svelte";
    import type { EventSocketMessage } from "../../lib/socket";
    import DmIcon from "./DmIcon.svelte";
    import type { UnreadDM } from "../../lib/friends";
    import { flip } from "svelte/animate";
    import { fade, fly } from "svelte/transition";
    import type { PublicUserInfo } from "../../lib/channel";

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

        unreadDMs.update((obj) => {
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
