<script lang="ts">
    import { authFetch } from "../../lib/auth";
    import type { FriendRequest } from "../../lib/friends";
    import { showInErrorModal } from "../../lib/stores";
    import Button from "../base/Button.svelte";
    import Tooltip from "../base/Tooltip.svelte";

    import MemberListMember from "../users/MemberListMember.svelte";
    import IcBaselineCheck from "~icons/ic/baseline-check";
    import IcBaselineClose from "~icons/ic/baseline-close";

    export let request: FriendRequest;

    export let callback = () => {};

    async function accept() {
        const resp = await authFetch(`/friends/requests/${request.user.id}`, {
            method: "POST",
        });

        if (!resp.ok) {
            const errorMessage = (await resp.json()).message;
            $showInErrorModal = `Failed to accept friend request: ${errorMessage}`;
            return;
        }

        callback();
    }

    async function deny() {
        const resp = await authFetch(`/friends/requests/${request.user.id}`, {
            method: "DELETE",
        });

        if (!resp.ok) {
            const errorMessage = (await resp.json()).message;
            $showInErrorModal = `Failed to deny friend request: ${errorMessage}`;
            return;
        }

        callback();
    }
</script>

<div class="request">
    <MemberListMember fullUsername member={request.user} />
    <span style="flex-grow: 1;" />
    {#if request.direction == "incoming"}
        <Tooltip text="Accept {request.user.username}'s friend request">
            <Button
                green
                compact
                nobg
                extraStyle="background-color: var(--green-transparent);"
                onClick={accept}
            >
                <IcBaselineCheck style="line-height: 0;" />
            </Button>
        </Tooltip>
    {/if}
    <Tooltip
        text={request.direction == "incoming"
            ? `Deny ${request.user.username}'s friend request`
            : `Cancel request to ${request.user.username}`}
    >
        <Button
            danger
            compact
            nobg
            extraStyle="background-color: var(--red-transparent);"
            onClick={deny}
        >
            <IcBaselineClose />
        </Button>
    </Tooltip>
</div>

<style>
    .request {
        display: flex;
        align-items: center;

        max-width: 350px;

        gap: 10px;
        padding: 10px 14px;
        border-radius: 6px;

        background-color: var(--bg-1);
    }
</style>
