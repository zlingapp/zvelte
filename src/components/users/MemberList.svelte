<script lang="ts">
    import type { PublicUserInfo } from "../../lib/channel";
    import MemberListMember from "./MemberListMember.svelte";
    import { authFetch } from "../../lib/auth";
    import SvgSpinnersRingResize from "~icons/svg-spinners/ring-resize";
    import type { EventSocketMessage } from "../../lib/socket";
    import TopicConsumer from "../TopicConsumer.svelte";
    import { currentGuild, guilds } from "../../lib/stores";
    import { onMount } from "svelte";

    let previousGuildId: string;
    let loading = true;

    async function fetchMembers(silent = false) {
        // WARNING: previousGuildId is INVALID IN THIS FUNCTION

        const guildId = $currentGuild?.id;

        if (guildId == null) {
            return;
        }

        if (!silent) {
            loading = true;
        }
        const resp = await authFetch(`/guilds/${guildId}/members`);

        // the line above took a considerable amount of time in which the user
        // could have clicked on another guild, so check that the current guild
        // is STILL the one we're trying to get the members for
        // see ChannelList.svelte for similar code
        if (guildId != $currentGuild?.id) {
            return;
        }

        if (!resp.ok) {
            console.error("failed to fetch members");
            loading = false;
            return;
        }

        const members = await resp.json();

        currentGuild.update((guild) => {
            guild.members = members;
            return guild;
        });

        // cache  results in the guilds list for when we switch back next 
        guilds.update((guilds) =>
            guilds.map((g) => {
                if (g.id == guildId) {
                    g.members = members;
                }
                return g;
            })
        );

        loading = false;
    }

    onMount(() => {
        currentGuild.subscribe(async (guild) => {
            if (guild == null) {
                return;
            }

            if (guild.id === previousGuildId) {
                return;
            }

            previousGuildId = guild.id;

            if (guild.members == null) {
                // fetch right now
                await fetchMembers();
            } else {
                // fetch in bg
                fetchMembers(true);
            }
        });
    });

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
        <label>Members — {$currentGuild.members.length}</label>
        {#each $currentGuild.members as member}
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
