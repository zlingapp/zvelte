<script lang="ts">
    import { authFetch } from "../../../../../lib/auth";
    import type { PublicUserInfo } from "../../../../../lib/channel";
    import { openDmWith } from "../../../../../lib/friends";
    import { dmChannelOpen, recentDMs, showInErrorModal } from "../../../../../lib/stores";
    import { getErrorMessage } from "../../../../../lib/util";
    import MemberListMember from "../../../../users/MemberListMember.svelte";
    import Friend from "../Friend.svelte";

    export let onlineOnly: boolean = false;
    export let friends: PublicUserInfo[];

    // TODO: filter when statuses are implemented
    // $: if (onlineOnly) {
    //     friends = friends.filter((f) => f.status === "online");
    // }

    async function removeFriend(friend: PublicUserInfo) {
        const resp = await authFetch(`/friends/${friend.id}`, {
            method: "DELETE",
        });

        if (!resp.ok) {
            const errorMessage = getErrorMessage(resp);
            $showInErrorModal = `Failed to remove friend: ${errorMessage}`;
            return;
        }

        friends = friends.filter((f) => f.id !== friend.id);
        $recentDMs = $recentDMs.filter((user) => user.id != friend.id);
    }
</script>

<div class="friends">
    <!-- svelte-ignore a11y-label-has-associated-control -->
    {#if onlineOnly}
        <label>Online Friends — {friends?.length || 0}</label>
    {:else}
        <label>All Friends — {friends?.length || 0}</label>
    {/if}
    <div class="friends-list">
        {#each friends as friend}
            <Friend onMessage={openDmWith} onRemove={removeFriend} {friend} />
        {/each}
    </div>
</div>

<style>
    .friends {
        padding: 20px;

        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .friends-list {
        display: flex;
        flex-direction: column;
        gap: 14px;

        max-width: 450px;
    }
</style>