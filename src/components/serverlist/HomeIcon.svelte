<script lang="ts">
    import { openDmWith } from "../../lib/friends";
    import { currentChannel, currentGuild, recentDMs } from "../../lib/stores";
    import Tooltip from "../base/Tooltip.svelte";
    import IcBaselineChat from "~icons/ic/baseline-chat";

    function onClick() {
        if ($recentDMs.length > 0) {
            openDmWith($recentDMs[0]);
        } else {
            $currentGuild = null;
            $currentChannel = null;
        }
    }
</script>

<Tooltip direction="right" selectable>
    <div slot="text" class="home-tooltip-name">Direct Messages</div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
        class="server-list-button guild-icon home-icon"
        class:current={$currentGuild == null}
        on:click={onClick}
    >
        <IcBaselineChat class="no-image" font-size="20px" />
    </div>
</Tooltip>

<style>
    @import "./ServerListItems.css";

    .home-tooltip-name {
        font-weight: 600;
        user-select: none;
    }
</style>
