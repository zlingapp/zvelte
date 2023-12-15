<script lang="ts">
    import TopicConsumer from "src/components/events/TopicConsumer.svelte";
    import ServerListAddGuild from "src/components/serverlist/items/ServerListAddGuild.svelte";
    import ServerListGuild from "src/components/serverlist/items/ServerListGuild.svelte";
    import ServerListHome from "src/components/serverlist/items/ServerListHome.svelte";
    import ServerListUnreadDm from "src/components/serverlist/items/ServerListUnreadDm.svelte";
    import { authFetch } from "src/lib/auth";
    import type { PublicUserInfo } from "src/lib/channel";
    import type { UnreadDM } from "src/lib/friends";
    import type { EventSocketMessage } from "src/lib/socket";
    import {
        currentDmChannel,
        guilds,
        recentDms,
        unreadDms,
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

        recentDms.update((arr: PublicUserInfo[]) => {
            const index = arr.findIndex((u) => u.id === userId);
            if (index !== -1) {
                const [el] = arr.splice(index, 1);
                arr.unshift(el);
            }
            return arr;
        });

        if ($currentDmChannel?.id == userId) {
            return;
        }

        unreadDms.update((obj: Record<string, UnreadDM>) => {
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

    $: unreadDmsList = Object.entries($unreadDms);
</script>

<TopicConsumer
    onReconnect={() => {}}
    eventFilter={(msg) => msg.topic.type == "dm_channel"}
    {onRelevantEvent}
/>

<div class="server-list outer">
    <ServerListHome />

    <div class="divider" />

    {#if unreadDmsList.length > 0}
        <div class="server-list" transition:fly={{ duration: 250 }}>
            {#each unreadDmsList as [id, unread] (id)}
                <ServerListUnreadDm
                    {id}
                    user={unread.user}
                    unread={unread.count}
                />
            {/each}
        </div>
        <div class="divider" />
    {/if}

    {#each $guilds as guild}
        <ServerListGuild {guild} />
    {/each}

    <ServerListAddGuild {createServer} {joinServer} />
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
