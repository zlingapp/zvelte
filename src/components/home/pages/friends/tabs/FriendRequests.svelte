<script lang="ts">
    import UiFriendRequest from "src/components/home/pages/friends/UiFriendRequest.svelte";
    import type { FriendRequest } from "src/lib/friends";

    export let outgoingFriendRequests: FriendRequest[];
    export let incomingFriendRequests: FriendRequest[];
    export let postFriendActionCallback = () => {};
</script>

<div class="friend-requests">
    <div class="friend-request-list">
        <label>Incoming — {incomingFriendRequests?.length || 0}</label>
        {#each incomingFriendRequests as request}
            <UiFriendRequest {request} callback={postFriendActionCallback} />
        {/each}
    </div>
    <div class="friend-request-list">
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
