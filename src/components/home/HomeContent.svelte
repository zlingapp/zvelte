<script lang="ts">
    import TopicConsumer from "src/components/TopicConsumer.svelte";
    import FriendsPage from "src/components/home/pages/friends/FriendsAndRequestsPage.svelte";
    import MessageList from "src/components/text/MessageList.svelte";
    import { dmChannelOpen } from "src/lib/stores";
</script>

{#if $dmChannelOpen == null}
    <FriendsPage />
{:else}
    <MessageList dm channel={$dmChannelOpen} />
    <TopicConsumer
        eventFilter={(msg) =>
            msg.topic.type == "user" &&
            msg.topic.id == $dmChannelOpen?.friend.id &&
            msg.event.type == "friendRemove"
        }
        onRelevantEvent={() => {
            $dmChannelOpen = null;
        }}
        onReconnect={() => {
            /* no need to do anything to subscribe/unsubscribe */
        }}
    />
{/if}
