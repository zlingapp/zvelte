<script lang="ts">
    import Button from "../base/Button.svelte";
    import IcRoundPersonAdd from "~icons/ic/round-person-add";
    import Modal from "../base/Modal.svelte";
    import { authFetch } from "../../lib/auth";
    import { showInErrorModal } from "../../lib/stores";

    let modalOpen = false;
    let userId: string;

    export let addFriendCallback = () => {};

    function onClick() {
        modalOpen = true;
    }

    async function addFriend(id) {
        // check if id is ascii alphanumeric
        if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) {
            $showInErrorModal = "Invalid user ID";
            return;
        }

        const resp = await authFetch(`/friends/requests/${id}`, {
            method: "POST",
        });

        if (resp.ok) {
            // sent or already exists
            addFriendCallback();
            return;
        } else {
            $showInErrorModal = (await resp.json()).message;
        }
    }
</script>

<Button green nobg compact {onClick}>
    <div class="add-friend">
        <IcRoundPersonAdd /><span>Add Friend</span>
    </div>
</Button>

<!-- svelte-ignore a11y-label-has-associated-control -->
<span style="color: var(--text-color);">
    <Modal bind:show={modalOpen}>
        <svelte:fragment slot="title">Add Friend</svelte:fragment>

        <svelte:fragment slot="content">
            <div style="min-width: 230px;" />
            <p>
                You need to get the User ID<br />of the person you want to add.
            </p>
            <label>User ID</label>
            <input
                type="text"
                style="font-family: monospace;"
                bind:value={userId}
            />
        </svelte:fragment>

        <svelte:fragment slot="actions">
            <Button
                green
                grow
                onClick={async () => {
                    modalOpen = false;
                    await addFriend(userId);
                }}
            >
                Add
            </Button>
            <Button
                onClick={() => {
                    modalOpen = false;
                }}
            >
                Cancel
            </Button>
        </svelte:fragment>
    </Modal>
</span>

<style>
    .add-friend {
        display: flex;
        align-items: center;

        line-height: 0;
        padding: 8px 12px;
        border-radius: 6px;
        gap: 8px;

        color: var(--green);
        background-color: var(--green-transparent);
        transition: background-color 0.1s ease-in-out;
    }

    .add-friend:hover {
        background-color: var(--green-transparent);
    }
</style>
