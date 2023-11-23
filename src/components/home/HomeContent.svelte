<script lang="ts">
    import { dmChannelOpen } from "../../lib/stores";
    import TopicConsumer from "../TopicConsumer.svelte";
    import MessageList from "../text/MessageList.svelte";
    import FriendsPage from "./pages/friends/FriendsAndRequestsPage.svelte";
</script>

{#if $dmChannelOpen == null}
    <FriendsPage />
{:else}
    <MessageList dm channel={$dmChannelOpen} />
    <TopicConsumer
        eventFilter={(msg) =>
            msg.topic.id == $dmChannelOpen.friend.id &&
            msg.topic.type == "user" &&
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
