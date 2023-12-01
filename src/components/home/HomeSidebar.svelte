<script lang="ts">
    import Button from "src/components/base/Button.svelte";
    import MemberListMember from "src/components/users/MemberListMember.svelte";
    import { openDmWith } from "src/lib/friends";
    import { dmChannelOpen, recentDMs, unreadDMs } from "src/lib/stores";
    import IcBaselineClose from "~icons/ic/baseline-close";
    import IcBaselinePeople from "~icons/ic/baseline-people";

    $: friendsOpen = $dmChannelOpen == null;

    $: readDMs = $recentDMs.filter((dmUser) => !(dmUser.id in $unreadDMs));
</script>

<div class="home-sidebar">
    <Button left compact grow onClick={() => ($dmChannelOpen = null)}>
        <div class="home-category" class:active={friendsOpen}>
            <IcBaselinePeople />
            <span>Friends</span>
        </div>
    </Button>

    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label>Direct Messages</label>
    {#each Object.entries($unreadDMs) as [id, unread]}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="dm-button" on:click={() => openDmWith(unread.user)}>
            <MemberListMember member={unread.user} />
            <span style="flex-grow: 1;" />
            <div class="unread-counter">
                {unread.count}
            </div>
        </div>
    {/each}
    {#each readDMs as dmUser}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
            class="dm-button"
            class:current={$dmChannelOpen?.id == dmUser.id}
            on:click={() => openDmWith(dmUser)}
        >
            <MemberListMember member={dmUser} />
            <span style="flex-grow: 1;" />
            <div
                class="dm-close-button"
                on:click={() => {
                    $recentDMs = $recentDMs.filter(
                        (user) => user.id != dmUser.id,
                    );

                    if ($dmChannelOpen?.id == dmUser.id) {
                        $dmChannelOpen = null;
                    }
                }}
            >
                <IcBaselineClose />
            </div>
        </div>
    {/each}
</div>

<style>
    .home-sidebar {
        min-width: 72px;
        display: flex;
        flex-direction: column;
        padding: 16px;
        gap: 12px;
    }

    .home-category {
        font-family: var(--font);
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 500;
        font-size: 16px;
        padding-inline: 10px;
        padding-block: 5px;
        color: var(--gray);
    }

    .home-category.active {
        color: var(--text-color);
    }

    .dm-button {
        display: flex;
        align-items: center;
        gap: 10px;
        border-radius: 8px;
        cursor: pointer;
        background: var(--bg-1);
        padding: 6px 8px;
    }

    .dm-button.current {
        filter: brightness(1.2);
    }

    .dm-button:hover {
        filter: brightness(1.3);
    }

    .dm-close-button {
        opacity: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        cursor: pointer;
        color: var(--gray);

        transition:
            opacity 100ms ease-in-out,
            color 100ms ease-in-out;
    }

    .dm-button:hover .dm-close-button {
        opacity: 1;
    }

    .dm-close-button:hover {
        color: var(--danger);
    }

    .unread-counter {
        width: 17.5px;
        height: 17.5px;
        font-size: 12px;
        background-color: var(--red);
        color: white;
        border-radius: 8px;
        text-align: center;
        line-height: 18px;
        font-weight: 600;
    }
</style>
