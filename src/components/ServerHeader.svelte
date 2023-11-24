<script lang="ts">
    import { currentGuild } from "../lib/stores";
    import { currentInstance } from "../lib/auth";
    import MaterialSymbolsDown from "~icons/material-symbols/keyboard-arrow-down";
    import GuildHeaderContextMenu from "./context-menus/GuildHeaderContextMenu.svelte";
    import ContextMenu from "./base/ContextMenu.svelte";
    import Button from "./base/Button.svelte";
    import { authFetch } from "../lib/auth";
    import Modal from "./base/Modal.svelte";
    import dayjs from "dayjs";
    import utc from "dayjs/plugin/utc";

    dayjs.extend(utc);
    let x;
    let y;
    let open;

    let selected;
    let uses;

    let isInviteModalOpen = false;
    let isInviteErrorShowing = false;

    function onCopyId() {
        navigator.clipboard.writeText($currentGuild.id);
    }
    function onCreateInvite() {
        isInviteModalOpen = true;
        isInviteErrorShowing = false;
    }

    async function createInvite() {
        let expires_at = selected(dayjs());
        let resp = await authFetch(`/invites/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                expires_at,
                guild_id: $currentGuild.id,
                uses: uses === null ? null : parseInt(uses),
            }),
        });
        if (!resp.ok) {
            isInviteErrorShowing = true;
            return;
        }
        isInviteErrorShowing = false;
        let json = await resp.json();
        navigator.clipboard.writeText(window.location.href + "/invite/" + json.code);
        isInviteModalOpen = false;
    }
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<Modal bind:show={isInviteModalOpen}>
    <svelte:fragment slot="title">Create Invites</svelte:fragment>

    <svelte:fragment slot="content">
        Create an invite for
        <span style="color: var(--green)">{$currentGuild.name}</span>?
        <br />
        This will create a link that other can use to join the server.
        <br />
        <label>Expires after</label>
        <select bind:value={selected} style="width:50%">
            <option value={(e) => e.add(30, "minute").utc().format()}
                >30 minutes</option
            >
            <option value={(e) => e.add(1, "hour").utc().format()}
                >1 hour</option
            >
            <option value={(e) => e.add(6, "hour").utc().format()}
                >6 hours</option
            >
            <option value={(e) => e.add(12, "hour").utc().format()}
                >12 hours</option
            >
            <option value={(e) => e.add(1, "day").utc().format()}>1 day</option>
            <option value={(e) => e.add(7, "day").utc().format()}>7 days</option
            >
            <option selected value={(_) => null}>Never</option>
        </select>
        <label>Max number of uses</label>
        <select bind:value={uses} style="width:50%">
            <option selected value={null}>No limit</option>
            <option value="1">1 use</option>
            <option value="5">5 uses</option>
            <option value="10">10 uses</option>
            <option value="25">25 uses</option>
            <option value="50">50 uses</option>
            <option value="100">100 uses</option>
        </select>
        <br/>
        <span style="color: var(--green)">The invite link will be copied to your clipboard</span>
    </svelte:fragment>

    <svelte:fragment slot="actions">
        <Button green grow onClick={createInvite}>Create Invite</Button>
        <Button grow onClick={() => (isInviteModalOpen = false)}
            >Nevermind...</Button
        >
    </svelte:fragment>
</Modal>

<ContextMenu bind:x bind:y bind:open animate={true}>
    <div class="server-head">
        <p class="server-name">{$currentGuild.name}</p>
        <Button
            compact
            onClick={(e) => {
                x = e.clientX;
                y = e.clientY;
                open = true;
            }}
            tooltip="More options"
        >
            <MaterialSymbolsDown />
        </Button>
    </div>
    <GuildHeaderContextMenu {onCopyId} {onCreateInvite} slot="menu" />
</ContextMenu>

<style>
    .server-head {
        height: 48px;
        background-color: var(--bg-1);
        box-shadow: 0px 2px 3px 0 rgba(0, 0, 0, 0.3);

        box-sizing: border-box;
        padding: 12px 16px;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .server-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
