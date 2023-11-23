<script lang="ts">
    import type { FriendRequest } from "../../../../../lib/friends";
    import UiFriendRequest from "../UiFriendRequest.svelte";

    export let outgoingFriendRequests: FriendRequest[];
    export let incomingFriendRequests: FriendRequest[];
    export let postFriendActionCallback = () => {};
</script>

<div class="friend-requests">
    <div class="friend-request-list">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label>Incoming — {incomingFriendRequests?.length || 0}</label>
        {#each incomingFriendRequests as request}
            <UiFriendRequest {request} callback={postFriendActionCallback} />
        {/each}
    </div>
    <div class="friend-request-list">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label>Outgoing — {outgoingFriendRequests?.length || 0}</label>
        {#each outgoingFriendRequests as request}
            <UiFriendRequest {request} callback={postFriendActionCallback} />
        {/each}
    </div>
</div>

<style>
    .friend-requests {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 25px;
    }

    .friend-request-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
</style>
