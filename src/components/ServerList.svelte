<script lang="ts">
    import { onMount } from "svelte";
    import { currentGuild, localUser } from "../lib/stores";
    import Button from "./Button.svelte";
    import IconUpload from "./IconUpload.svelte";
    import Modal from "./Modal.svelte";
    import { each } from "svelte/internal";
    import Tooltip from "./Tooltip.svelte";
    import MaterialSymbolsAdd from "~icons/material-symbols/add";
    import { auth_fetch } from "../lib/auth";

    let guilds: { name: string; id: string }[] = [];

    async function fetchGuilds() {
        let resp = await auth_fetch("/api/guilds");
        if (resp.status != 200) {
            return;
        }
        guilds = await resp.json();
    }

    onMount(async () => {
        await fetchGuilds();
    });

    let addModal = false; // show the "Create server?" modal

    async function createNew() {
        addModal = false;
        createModal = true;
    }

    async function joinExisting() {
        addModal = false;
    }

    let createModal = false;
    let createServerName = `${$localUser?.name.split("#")[0]}'s Server`;

    async function createServer() {
        createModal = false;
        // todo: validate createServerName

        let reply = await auth_fetch("/api/guilds", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: createServerName }),
        });
        // alert((await reply.json()).guild_id);
        await fetchGuilds();
    }
</script>

<div class="server-list">
    {#each guilds as guild}
        <Tooltip direction="right" selectable>
            <div class="guild-tooltip" slot="text">
                <div class="guild-tooltip-name">{guild.name}</div>
                <div class="guild-tooltip-id">{guild.id}</div>
            </div>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
                class="guild-icon"
                class:current={guild.id == $currentGuild?.id}
                on:click={() => {
                    $currentGuild = { ...guild };
                }}
            >
                {guild.name[0].toUpperCase()}
            </div>
        </Tooltip>
    {/each}

    <div class="divider" />

    <Tooltip text="Create Server" direction="right">
        <button class="guild-icon" on:click={() => (addModal = true)}
            ><MaterialSymbolsAdd /></button
        >
    </Tooltip>

    <Modal bind:show={addModal}>
        <svelte:fragment slot="title">Create Server?</svelte:fragment>

        <svelte:fragment slot="content">
            Do you want to <span class="emphasis">create a server</span>?
            <br /><br />
            <span class="emphasis">Servers</span> are invite-only communities
            where
            <br />
            you can chat in channels, organize roles, and
            <br />
            manage a list of members.
            <br /><br />
            Alternatively, you can join someone else's
            <br />server as a member instead.
        </svelte:fragment>

        <svelte:fragment slot="actions">
            <Button green onClick={createNew}>Create New Server</Button>
            <Button onClick={joinExisting}>Join Existing Server</Button>
        </svelte:fragment>
    </Modal>

    <!-- svelte-ignore a11y-label-has-associated-control -->
    <Modal bind:show={createModal}>
        <svelte:fragment slot="title">Create Your Server</svelte:fragment>

        <svelte:fragment slot="content">
            <label>Server Icon</label>
            <IconUpload />
            <label>Server Name</label>
            <input type="text" bind:value={createServerName} />
        </svelte:fragment>

        <svelte:fragment slot="actions">
            <Button green onClick={createServer}>Let's go!</Button>
            <span style="flex-grow: 1;" />
            <Button onClick={joinExisting}>Nevermind</Button>
        </svelte:fragment>
    </Modal>
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

    .emphasis {
        font-weight: bold;
        color: var(--green);
    }

    .guild-icon {
        background-color: var(--bg-1);
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;

        width: 48px;
        height: 48px;
        border-radius: 50%;

        transition: border-radius 90ms ease-in-out;
    }

    .guild-tooltip {
        text-align: left;
    }

    .guild-tooltip-name {
        font-weight: 600;
    }

    .guild-tooltip-id {
        font-size: 12px;
        color: var(--gray);
    }

    .current {
        outline: 3px solid rgba(255, 255, 255, 0.2);
        border-radius: 40%;
    }

    button.guild-icon {
        border: none;
        color: var(--green);
    }
</style>
