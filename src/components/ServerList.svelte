<script lang="ts">
    import { onMount } from "svelte";
    import MaterialSymbolsAdd from "~icons/material-symbols/add";
    import { authFetch } from "../lib/auth";
    import { guilds, localUser, showInErrorModal } from "../lib/stores";
    import ServerIcon from "./ServerIcon.svelte";
    import Button from "./base/Button.svelte";
    import IconUpload from "./base/IconUpload.svelte";
    import Modal from "./base/Modal.svelte";
    import Tooltip from "./base/Tooltip.svelte";

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

    let isAddModalVisible = false; // show the "Create server?" modal

    async function openCreateModal() {
        isAddModalVisible = false;
        isCreateModalVisible = true;
    }

    async function openJoinModal() {
        isAddModalVisible = false;
        isJoinModalVisible = true;
    }

    let isCreateModalVisible = false;
    let createServerName = `${$localUser?.name.split("#")[0]}'s Server`;
    let createServerIcon = null;

    async function createServer() {
        isCreateModalVisible = false;
        // todo: validate createServerName

        let reply = await authFetch("/guilds", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: createServerName,
                icon: createServerIcon?.url,
            }),
        });

        await fetchGuilds();
    }

    let isJoinModalVisible = false; // show the "Join server?" modal
    let joinServerId = "";

    async function joinServer() {
        isJoinModalVisible = false;

        if (!joinServerId) {
            return;
        }

        let reply = await authFetch(`/guilds/${joinServerId}/join`);
        if (!reply.ok) {
            // TODO: handle me better
            $showInErrorModal = `Failed to join server: ${reply.statusText}`;
            return;
        } else {
            await fetchGuilds();
        }
    }
</script>

<div class="server-list">
    {#each $guilds as guild}
        <ServerIcon {guild} />
    {/each}

    <div class="divider" />

    <Tooltip text="Create Server" direction="right">
        <button class="guild-icon" on:click={() => (isAddModalVisible = true)}
            ><MaterialSymbolsAdd /></button
        >
    </Tooltip>

    <Modal bind:show={isAddModalVisible}>
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
            <Button green grow onClick={openCreateModal}
                >Create New Server</Button
            >
            <Button grow onClick={openJoinModal}>Join Existing Server</Button>
        </svelte:fragment>
    </Modal>

    <!-- svelte-ignore a11y-label-has-associated-control -->
    <Modal bind:show={isCreateModalVisible}>
        <svelte:fragment slot="title">Create Your Server</svelte:fragment>

        <svelte:fragment slot="content">
            <label>Server Icon</label>
            <IconUpload bind:uploadedFile={createServerIcon} />
            <label>Server Name</label>
            <input type="text" bind:value={createServerName} />
        </svelte:fragment>

        <svelte:fragment slot="actions">
            <Button green grow onClick={createServer}>Let's go!</Button>
            <Button grow onClick={() => (isCreateModalVisible = false)}>Nevermind</Button>
        </svelte:fragment>
    </Modal>

    <!-- svelte-ignore a11y-label-has-associated-control -->
    <Modal bind:show={isJoinModalVisible}>
        <svelte:fragment slot="title">Join a Server</svelte:fragment>

        <svelte:fragment slot="content">
            <div style="min-width: 230px;" />
            <label>Server ID</label>
            <input
                type="text"
                style="font-family: monospace;"
                bind:value={joinServerId}
            />
        </svelte:fragment>

        <svelte:fragment slot="actions">
            <Button green grow onClick={joinServer}>Join</Button>
            <Button onClick={() => (isJoinModalVisible = false)}>Cancel</Button>
        </svelte:fragment>
    </Modal>
</div>

<style>
    @import "./ServerIcon.css";

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

    .divider {
        padding: 0;
        margin: 0;
        width: 32px;
        height: 1px;
        background-color: var(--bg-3);
    }
</style>
