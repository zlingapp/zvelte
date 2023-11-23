<script lang="ts">
    import { dmChannelOpen, localUser } from "../../lib/stores";
    import Button from "../base/Button.svelte";
    import IcBaselinePeople from '~icons/ic/baseline-people'
    import MemberListMember from "../users/MemberListMember.svelte";

    $: friendsOpen = $dmChannelOpen == null;
</script>

<div class="home-sidebar">
    <Button left compact grow onClick={() => $dmChannelOpen = null}>
        <div class="home-category" class:active={friendsOpen}>
            <IcBaselinePeople />
            <span>Friends</span>
        </div>
    </Button>

    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label>Direct Messages</label>
    <!-- <MemberListMember member={{...$localUser, username: $localUser.name }} /> -->
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
</style>
