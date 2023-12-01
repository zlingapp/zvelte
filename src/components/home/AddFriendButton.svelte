<script lang="ts">
    import Button from "src/components/base/Button.svelte";
    import Modal from "src/components/base/Modal.svelte";
    import { authFetch } from "src/lib/auth";
    import { showInErrorModal } from "src/lib/stores";
    import { getErrorMessage } from "src/lib/util";
    import IcRoundPersonAdd from "~icons/ic/round-person-add";

    let modalOpen = false;
    let username: string;

    export let addFriendCallback = () => {};

    function onClick() {
        modalOpen = true;
    }

    async function addFriend() {
        const resp = await authFetch("/friends/requests", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username }),
        });

        username = ""; // reset input

        if (resp.ok) {
            // sent or already exists
            addFriendCallback();
            return;
        } else {
            const errorMessage = await getErrorMessage(resp);
            $showInErrorModal = "Failed to add friend: " + errorMessage;
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
                What is the username of the <br /> 
                friend you want to add?
            </p>
            <label>Username</label>
            <input
                type="text"
                style="font-family: monospace;"
                bind:value={username}
            />
        </svelte:fragment>

        <svelte:fragment slot="actions">
            <Button
                green
                grow
                onClick={async () => {
                    modalOpen = false;
                    await addFriend();
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
