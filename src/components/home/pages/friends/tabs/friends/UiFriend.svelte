<script lang="ts">
    import Tooltip from "src/components/base/Tooltip.svelte";
    import MemberListMember from "src/components/guild/member-list/MemberListMember.svelte";
    import type { PublicUserInfo } from "src/lib/channel";
    import IcBaselineClose from "~icons/ic/baseline-close";
    import MaterialSymbolsChatBubble from "~icons/material-symbols/chat-bubble";
    // import IcBaselineCall from '~icons/ic/baseline-call'
    // import IcBaselineVideoCall from '~icons/ic/baseline-video-call'

    export let friend: PublicUserInfo;
    export let onMessage: (friend: PublicUserInfo) => void;
    export let onRemove: (friend: PublicUserInfo) => void;
</script>

<div class="friend">
    <MemberListMember member={friend} />
    <span style="flex-grow: 1;" />
    <div class="actions">
        <Tooltip text={`Message ${friend.username.split("#")[0]}`}>
            <div class="friend-action" on:click={() => onMessage(friend)}>
                <MaterialSymbolsChatBubble />
            </div>
        </Tooltip>
        <!-- <Tooltip text={`Call ${friend.username.split("#")[0]}`}>
            <div class="friend-action">
                <IcBaselineCall />
            </div>
        </Tooltip>
        <Tooltip text={`Video Call ${friend.username.split("#")[0]}`}>
            <div class="friend-action">
                <IcBaselineVideoCall />
            </div>
        </Tooltip> -->
        <div class="divider" />
        <Tooltip text={`Unfriend ${friend.username.split("#")[0]}`}>
            <div class="friend-action" on:click={() => onRemove(friend)}>
                <IcBaselineClose />
            </div>
        </Tooltip>
    </div>
</div>

<style>
    .friend {
        display: flex;
        gap: 10px;
        align-items: center;
        padding: 10px;
        background: var(--bg-1);
        border-radius: 4px;
    }

    .actions {
        display: flex;
        align-items: center;
    }

    .friend-action {
        color: var(--gray);
        cursor: pointer;
        line-height: 0;
        font-size: 16px;
        padding: 8px;
        border-radius: 50px;
    }

    .friend-action:hover {
        color: var(--text-color);
    }

    .divider {
        height: 20px;
        width: 1px;
        background-color: var(--disabled);
        margin: 0 5px;
    }
</style>
