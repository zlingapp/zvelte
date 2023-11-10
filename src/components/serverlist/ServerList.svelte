<script lang="ts">
    import { onMount } from "svelte";
    import { authFetch } from "../../lib/auth";
    import { guilds, showInErrorModal } from "../../lib/stores";
    import ServerIcon from "./GuildIcon.svelte";
    import CreateServerIcon from "./AddGuildIcon.svelte";
    import type { UploadedFile } from "../../lib/upload";
    import HomeIcon from "./HomeIcon.svelte";

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
</script>

<div class="server-list">
    <HomeIcon />

    <div class="divider" />

    {#each $guilds as guild}
        <ServerIcon {guild} />
    {/each}

    <CreateServerIcon {createServer} {joinServer} />
</div>

<style>
    .server-list {
        min-width: 72px;
        background-color: var(--bg-2);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-block: 16px;
        gap: 12px;
    }

    .divider {
        padding: 0;
        margin: 0;
        width: 32px;
        height: 2px;
        background-color: var(--bg-0);
    }
</style>
