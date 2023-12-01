<script lang="ts">
    import MaterialSymbolsAdd from "~icons/material-symbols/add";
    import Tooltip from "../base/Tooltip.svelte";
    import Modal from "../base/Modal.svelte";
    import Button from "../base/Button.svelte";
    import IconUpload from "../base/IconUpload.svelte";
    import { localUser } from "../../lib/stores";
    import type { UploadedFile } from "../../lib/upload";

    export let createServer: (name: String, icon?: UploadedFile) => void;
    export let joinServer: (id: String) => void;

    let isAddModalVisible = false; // show the "would you like to create or join a server" modal

    async function openCreateModal() {
        isAddModalVisible = false;
        isCreateModalVisible = true;
    }

    async function openJoinModal() {
        isAddModalVisible = false;
        isJoinModalVisible = true;
    }

    let isCreateModalVisible = false; // show the "create a server" modal
    let createServerName = `${$localUser?.name.split("#")[0]}'s Server`;
    let createServerIcon: UploadedFile = null;

    let isJoinModalVisible = false; // show the "Join server?" modal
    let joinServerId = "";
</script>

<Tooltip text="Create Server" direction="right">
    <button
        class="server-list-button guild-add-icon"
        on:click={() => {
            isAddModalVisible = true;
        }}
    >
        <MaterialSymbolsAdd />
    </button>
</Tooltip>

<Modal bind:show={isAddModalVisible}>
    <svelte:fragment slot="title">Create Server?</svelte:fragment>

    <svelte:fragment slot="content">
        Do you want to <span class="emphasis">create a server</span>?
        <br /><br />
        <span class="emphasis">Servers</span> are invite-only communities where
        <br />
        you can chat in channels, organize roles, and
        <br />
        manage a list of members.
        <br /><br />
        Alternatively, you can join someone else's
        <br />server as a member instead.
    </svelte:fragment>

    <svelte:fragment slot="actions">
        <Button green grow onClick={openCreateModal}>Create New Server</Button>
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
        <Button
            green
            grow
            onClick={() => {
                isCreateModalVisible = false;
                createServer(createServerName, createServerIcon);
            }}
        >
            Let's go!
        </Button>
        <Button
            grow
            onClick={() => {
                isCreateModalVisible = false;
            }}
        >
            Nevermind
        </Button>
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
        <Button
            green
            grow
            onClick={() => {
                isJoinModalVisible = false;
                joinServer(joinServerId);
            }}
        >
            Join
        </Button>
        <Button
            onClick={() => {
                isJoinModalVisible = false;
            }}
        >
            Cancel
        </Button>
    </svelte:fragment>
</Modal>

<style>
    @import "./ServerListItems.css";

    .emphasis {
        font-weight: bold;
        color: var(--green);
    }

    .guild-add-icon {
        color: var(--green);
    }
</style>
