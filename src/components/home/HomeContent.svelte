<script lang="ts">
    import { authFetch } from "../../lib/auth";
    import { dmChannelOpen, showInErrorModal } from "../../lib/stores";
    import Button from "../base/Button.svelte";
    import MessageList from "../text/MessageList.svelte";
    import IcBaselinePeople from "~icons/ic/baseline-people";
    import IcRoundPersonAdd from "~icons/ic/round-person-add";
    import MemberListMember from "../users/MemberListMember.svelte";
    import type { PublicUserInfo } from "../../lib/channel";
    import { onMount } from "svelte";
    import IconParkOutlineSleepOne from "~icons/icon-park-outline/sleep-one";
    import SvgSpinnersRingResize from "~icons/svg-spinners/ring-resize";
    import AddFriendButton from "./AddFriendButton.svelte";
    import UiFriendRequest from "./UiFriendRequest.svelte";
    import type { FriendRequest } from "../../lib/friends";

    enum Filter {
        Online,
        All,
        Pending,
        Blocked,
    }

    let filter: Filter = Filter.Online;
    let friends: PublicUserInfo[] = undefined;
    let friendRequests: FriendRequest[] = undefined;

    async function fetchFriends() {
        friends = undefined;
        const resp = await authFetch("/friends");
        if (resp.ok) {
            friends = await resp.json();
            return;
        }
        $showInErrorModal = "Failed to fetch friends";
    }

    async function fetchFriendRequests() {
        friendRequests = undefined;
        const resp = await authFetch("/friends/requests");
        if (resp.ok) {
            friendRequests = await resp.json();
            return;
        }
        $showInErrorModal = "Failed to fetch friend requests";
    }

    async function postFriendActionCallback() {
        await fetchFriendRequests();
        filter = Filter.Pending;
        fetchFriends();
    }

    onMount(() => {
        fetchFriends();
        fetchFriendRequests();
    });

    $: onlineFriends = friends; // todo: filter when statuses are implemented
    $: outgoingFriendRequests = friendRequests?.filter(
        (r) => r.direction == "outgoing"
    );
    $: incomingFriendRequests = friendRequests?.filter(
        (r) => r.direction == "incoming"
    );
</script>

{#if $dmChannelOpen == null}
    <div class="friends-page">
        <div class="head">
            <div class="icon">
                <IcBaselinePeople />
            </div>
            <div class="title">Friends</div>
            <div class="actions">
                <Button nobg compact onClick={() => (filter = Filter.Online)}>
                    <div
                        class="tab-button"
                        class:active={filter == Filter.Online}
                    >
                        <span>Online</span>
                        <div class="indicator">
                            {onlineFriends?.length || 0}
                        </div>
                    </div>
                </Button>
                <Button nobg compact onClick={() => (filter = Filter.All)}>
                    <div class="tab-button" class:active={filter == Filter.All}>
                        <span>All</span>
                        <div class="indicator">{friends?.length || 0}</div>
                    </div>
                </Button>
                <Button nobg compact onClick={() => (filter = Filter.Pending)}>
                    <div
                        class="tab-button"
                        class:active={filter == Filter.Pending}
                    >
                        <span>Pending</span>
                        <div
                            class="indicator"
                            class:red={incomingFriendRequests?.length > 0}
                        >
                            {incomingFriendRequests?.length || 0}
                        </div>
                    </div>
                </Button>
                <Button nobg compact onClick={() => (filter = Filter.Blocked)}>
                    <div
                        class="tab-button"
                        class:active={filter == Filter.Blocked}
                    >
                        <span>Blocked</span>
                    </div>
                </Button>
                <AddFriendButton addFriendCallback={postFriendActionCallback} />
            </div>
        </div>
        {#if filter != Filter.Pending}
            {#if friends === undefined}
                <div class="center">
                    <SvgSpinnersRingResize />
                </div>
            {:else if friends === null}
                Error fetching friends
            {:else if friends.length > 0}
                {#each friends as friend}
                    <MemberListMember member={friend} />
                {/each}
            {:else}
                <div class="center">
                    <div>
                        {#if filter == Filter.All || (filter == Filter.Online && friends.length == 0)}
                            You haven't added any friends yet.
                        {:else if filter == Filter.Online}
                            *crickets* No friends online!
                        {:else if filter == Filter.Blocked}
                            You haven't blocked anyone. Congratulations!
                        {/if}
                    </div>
                    {#if filter != Filter.Blocked && friends.length == 0}
                        <div style="display: flex;">
                            <AddFriendButton addFriendCallback={postFriendActionCallback} />
                            <Button
                                nobg
                                compact
                                onClick={() => (filter = Filter.Pending)}
                            >
                                <div class="tab-button">
                                    <span>Pending</span>
                                    <div
                                        class="indicator"
                                        class:red={incomingFriendRequests?.length >
                                            0}
                                    >
                                        {incomingFriendRequests?.length}
                                    </div>
                                </div>
                            </Button>
                        </div>
                    {/if}
                </div>
            {/if}
        {:else if friendRequests === undefined}
            Fetching...
        {:else if friendRequests === null}
            Error fetching friend requests
        {:else if friendRequests.length > 0}
            <div class="friend-requests">
                <div class="friend-request-list">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label
                        >Incoming — {incomingFriendRequests?.length || 0}</label
                    >
                    {#each incomingFriendRequests as request}
                        <UiFriendRequest {request} callback={postFriendActionCallback} />
                    {/each}
                </div>
                <div class="friend-request-list">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label
                        >Outgoing — {outgoingFriendRequests?.length || 0}</label
                    >
                    {#each outgoingFriendRequests as request}
                        <UiFriendRequest {request} callback={postFriendActionCallback} />
                    {/each}
                </div>
            </div>
        {:else}
            <div class="center">
                <div>No friend requests. You're all caught up!</div>
            </div>
        {/if}
    </div>
{:else}
    <MessageList
        channel={{
            id: "dm",
            name: "Direct Messages",
            permissions: null,
            type: "text",
        }}
    />
{/if}

<style>
    .center {
        margin-top: 50px;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 18px;
        color: var(--disabled-text);
        user-select: none;
    }

    .friends-page {
        display: block;
        height: 100%;
        width: 100%;
    }

    .head {
        min-height: 48px;
        display: flex;
        align-items: center;

        background-color: var(--bg-0);
        box-shadow: 0px 2px 3px 0 rgba(0, 0, 0, 0.3);
        z-index: 1;

        padding-left: 18px;
        gap: 10px;

        flex-wrap: wrap;
    }

    .icon {
        line-height: 0;
        color: var(--text-color);
    }

    .title {
        line-height: 0;
        font-weight: 600;
        margin-right: 20px;
    }

    .actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
    }

    .tab-button {
        color: var(--gray);
        padding: 8px 12px;
        border-radius: 6px;

        transition: background-color 0.1s ease-in-out;
    }

    .tab-button:hover {
        background-color: var(--channel-hover-bg);
    }

    .tab-button.active {
        color: var(--text-color);
        background-color: var(--channel-current-bg);
    }

    .indicator {
        display: inline-block;
        margin-left: 5px;
        color: var(--disabled-text);
    }

    .indicator.red {
        color: var(--text-color);
        background-color: var(--red);
        border-radius: 9px;
        min-width: 18px;
        height: 18px;
        padding-inline: 2px;
        line-height: 18px;
    }

    .tab-button.active > .indicator {
        color: var(--gray-2);
    }

    .friend-requests {
        margin: 20px;
        display: flex;
        flex-direction: column;
        gap: 25px;
    }

    .friend-request-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
</style>
