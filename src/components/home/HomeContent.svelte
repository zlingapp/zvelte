<script lang="ts">
    import TopicConsumer from "src/components/events/TopicConsumer.svelte";
    import FriendsPage from "src/components/home/pages/friends/Friends.svelte";
    import MessageList from "src/components/text/MessageList.svelte";
    import { currentDmChannel } from "src/lib/stores";
</script>

{#if $currentDmChannel == null}
    <FriendsPage />
{:else}
    <MessageList dm channel={$currentDmChannel} />
    <TopicConsumer
        eventFilter={(msg) =>
            msg.topic.type == "user" &&
            msg.topic.id == $currentDmChannel?.friend.id &&
            msg.event.type == "friendRemove"
        }
        onRelevantEvent={() => {
            $currentDmChannel = null;
        }}
        onReconnect={() => {
            /* no need to do anything to subscribe/unsubscribe */
        }}
    />
{/if}
