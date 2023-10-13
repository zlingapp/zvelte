<script lang="ts">
    import type { PublicUserInfo } from "../../lib/channel";
    import MemberListMember from "./MemberListMember.svelte";
    import { authFetch } from "../../lib/auth";
    import SvgSpinnersRingResize from "~icons/svg-spinners/ring-resize";
    import type { EventSocketMessage } from "../../lib/socket";
    import TopicConsumer from "../TopicConsumer.svelte";
    import { currentGuild } from "../../lib/stores";

    export let guild_id: string;
    let members: PublicUserInfo[] = [];

    let loading = true;

    async function fetchMembers() {
        loading = true;
        const resp = await authFetch(`/guilds/${guild_id}/members`);

        if (!resp.ok) {
            alert("Failed to fetch members");
            loading = false;
            return;
        }

        members = await resp.json();
        loading = false;
    }

    $: fetchMembers();

    async function onRelevantEvent(esm: EventSocketMessage) {
        if (esm.event.type == "memberListUpdate") {
            await fetchMembers();
        }
    }
</script>

<TopicConsumer
    {onRelevantEvent}
    eventFilter={(esm) =>
        esm.topic.type == "guild" && esm.topic.id == $currentGuild.id}
    onReconnect={fetchMembers}
/>
<div class="member-list">
    {#if loading}
        <div class="status"><SvgSpinnersRingResize /></div>
    {:else}
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label>Members — {members.length}</label>
        {#each members as member}
            <MemberListMember {member} />
        {/each}
    {/if}
</div>

<style>
    .member-list {
        padding: 8px 12px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    label {
        padding-top: 8px;
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
