<script lang="ts">
    import { onMount } from "svelte";
    import type { PublicUserInfo } from "../../lib/channel";
    import MemberListMember from "./MemberListMember.svelte";
    import { auth_fetch } from "../../lib/auth";
    import SvgSpinnersRingResize from "~icons/svg-spinners/ring-resize";

    export let guild_id: string;
    let members: PublicUserInfo[] = [];

    let loading = true;

    $: {
        loading = true;
        auth_fetch(`/api/guilds/${guild_id}/members`)
            .then((res) => res.json())
            .then((list) => {
                members = list;
                loading = false;
            });
    }
</script>

<div class="member-list">
    {#if loading}
        <div class="status"><SvgSpinnersRingResize /></div>
    {:else}
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label>members</label>
        {#each members as member}
            <MemberListMember {member} />
        {/each}
    {/if}
</div>

<style>
    .member-list {
        padding: 8px 12px;
    }

    .status {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50px;

        color: var(--gray);
        user-select: none;
    }
</style>
