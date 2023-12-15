<script lang="ts">
    import Tooltip from "src/components/base/Tooltip.svelte";
    import { openDmWith } from "src/lib/friends";
    import { currentGuildChannel, currentGuild, recentDms } from "src/lib/stores";
    import IcBaselineChat from "~icons/ic/baseline-chat";

    function onClick() {
        if ($recentDms.length > 0) {
            openDmWith($recentDms[0]);
        } else {
            $currentGuild = null;
            $currentGuildChannel = null;
        }
    }
</script>

<Tooltip direction="right" selectable>
    <div slot="text" class="home-tooltip-name">Direct Messages</div>
    <div
        class="server-list-button guild-icon home-icon"
        class:current={$currentGuild == null}
        on:click={onClick}
    >
        <IcBaselineChat class="no-image" font-size="20px" />
    </div>
</Tooltip>

<!-- svelte-ignore css-unused-selector -->
<style>
    @import "./ServerListItems.css";

    .home-tooltip-name {
        font-weight: 600;
        user-select: none;
    }
</style>
