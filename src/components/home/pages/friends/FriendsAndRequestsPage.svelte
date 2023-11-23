<script lang="ts">
    import IcBaselinePeople from "~icons/ic/baseline-people";
    import { onMount } from "svelte";
    import SvgSpinnersRingResize from "~icons/svg-spinners/ring-resize";
    import type { PublicUserInfo } from "../../../../lib/channel";
    import type { FriendRequest } from "../../../../lib/friends";
    import { authFetch } from "../../../../lib/auth";
    import { showInErrorModal } from "../../../../lib/stores";
    import Button from "../../../base/Button.svelte";
    import AddFriendButton from "../../AddFriendButton.svelte";
    import FriendRequests from "./tabs/FriendRequests.svelte";
    import Friends from "./tabs/Friends.svelte";
    import { getErrorMessage } from "../../../../lib/util";
    import TopicConsumer from "../../../TopicConsumer.svelte";
    import type { Event, EventSocketMessage } from "../../../../lib/socket";

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
        const errorMessage = getErrorMessage(resp);
        $showInErrorModal = `Failed to fetch friends: ${errorMessage}`;
    }

    async function fetchFriendRequests() {
        friendRequests = undefined;
        const resp = await authFetch("/friends/requests");
        if (resp.ok) {
            friendRequests = await resp.json();
            return;
        }
        const errorMessage = getErrorMessage(resp);
        $showInErrorModal = `Failed to fetch friend requests: ${errorMessage}`;
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
        (r) => r.direction == "outgoing",
    );
    $: incomingFriendRequests = friendRequests?.filter(
        (r) => r.direction == "incoming",
    );

    async function onRelevantEvent(msg: EventSocketMessage) {
        switch (msg.event.type) {
            case "friendRequestUpdate": {
                switch (msg.event.state) {
                    case "sent":
                        // someone sent us a friend request
                        friendRequests = [
                            ...friendRequests,
                            {
                                direction: "incoming",
                                user: msg.event.user,
                            },
                        ];
                        break;
                    case "accepted":
                        const id = msg.event.user.id;
                        // someone accepted our friend request
                        friends = [...friends, msg.event.user];
                        friendRequests = friendRequests.filter(
                            (r) => r.user.id != id,
                        );
                        break;
                }
                break;
            }
            case "friendRequestRemove": {
                const id = msg.event.user.id;
                friendRequests = friendRequests.filter((r) => r.user.id != id);
                break;
            }
            case "friendRemove": {
                const id = msg.event.user.id;
                friends = friends.filter((f) => f.id != id);
                break;
            }
        }
    }
</script>

<TopicConsumer
    eventFilter={(e) => e.topic.type == "user"}
    onReconnect={() => {
        /* no need to do anything to subscribe/unsubscribe */
    }}
    {onRelevantEvent}
/>
<div class="friends-page">
    <div class="head">
        <div class="icon">
            <IcBaselinePeople />
        </div>
        <div class="title">Friends</div>

        <!-- tabs at the top of the friends list -->
        <div class="actions">
            <!-- online -->
            <Button nobg compact onClick={() => (filter = Filter.Online)}>
                <div class="tab-button" class:active={filter == Filter.Online}>
                    <span>Online</span>
                    <div class="indicator">{onlineFriends?.length || 0}</div>
                </div>
            </Button>

            <!-- all -->
            <Button nobg compact onClick={() => (filter = Filter.All)}>
                <div class="tab-button" class:active={filter == Filter.All}>
                    <span>All</span>
                    <div class="indicator">{friends?.length || 0}</div>
                </div>
            </Button>

            <!-- pending -->
            <Button nobg compact onClick={() => (filter = Filter.Pending)}>
                <div class="tab-button" class:active={filter == Filter.Pending}>
                    <span>Pending</span>
                    <div
                        class="indicator"
                        class:red={incomingFriendRequests?.length > 0}
                    >
                        {incomingFriendRequests?.length || 0}
                    </div>
                </div>
            </Button>

            <!-- blocked -->
            <!-- <Button nobg compact onClick={() => (filter = Filter.Blocked)}>
                <div class="tab-button" class:active={filter == Filter.Blocked}>
                    <span>Blocked</span>
                </div>
            </Button> -->

            <!-- add friend -->
            <AddFriendButton addFriendCallback={postFriendActionCallback} />
        </div>
    </div>

    {#if filter != Filter.Pending}
        <!-- show friends -->
        {#if friends === undefined}
            <div class="center">
                <SvgSpinnersRingResize />
            </div>
        {:else if friends === null}
            <div class="center">
                <div style="margin: 8px; color: var(--red);">
                    Error getting friends list
                </div>
                <Button
                    accent
                    extraStyle="color: var(--text-color);"
                    onClick={fetchFriendRequests}>Retry</Button
                >
            </div>
        {:else if friends.length > 0}
            <Friends bind:friends onlineOnly={filter == Filter.Online} />
        {:else}
            <div class="center">
                <div>
                    {#if filter == Filter.All || (filter == Filter.Online && friends.length == 0)}
                        You haven't added any friends yet.
                    {:else if filter == Filter.Online}
                        *crickets* No friends online!
                    {/if}
                </div>
                <div style="display: flex;">
                    <AddFriendButton
                        addFriendCallback={postFriendActionCallback}
                    />
                    <Button
                        nobg
                        compact
                        onClick={() => (filter = Filter.Pending)}
                    >
                        <div class="tab-button">
                            <span>Pending</span>
                            <div
                                class="indicator"
                                class:red={incomingFriendRequests?.length > 0}
                            >
                                {incomingFriendRequests?.length}
                            </div>
                        </div>
                    </Button>
                </div>
            </div>
        {/if}
        <!-- show friend requests -->
    {:else if friendRequests === undefined}
        <div class="center">
            <SvgSpinnersRingResize />
        </div>
    {:else if friendRequests === null}
        <div class="center">
            <div style="margin: 8px; color: var(--red);">
                Error getting friend requests list
            </div>
            <Button
                accent
                extraStyle="color: var(--text-color);"
                onClick={fetchFriendRequests}>Retry</Button
            >
        </div>
    {:else if friendRequests.length > 0}
        <!-- we have friend requests to show -->
        <FriendRequests
            {outgoingFriendRequests}
            {incomingFriendRequests}
            {postFriendActionCallback}
        />
    {:else}
        <div class="center">
            <div>No friend requests. You're all caught up!</div>
        </div>
    {/if}
</div>

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
</style>
