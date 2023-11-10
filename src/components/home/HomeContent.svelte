<script lang="ts">
    import { dmChannelOpen } from "../../lib/stores";
    import Button from "../base/Button.svelte";
    import MessageList from "../text/MessageList.svelte";
    import IcBaselinePeople from "~icons/ic/baseline-people";
    import IcRoundPersonAdd from "~icons/ic/round-person-add";

    enum Filter {
        Online,
        All,
        Pending,
        Blocked,
    }

    let filter: Filter = Filter.Online;
</script>

{#if $dmChannelOpen == null}
    <div class="friends-page">
        <div class="head">
            <div class="icon">
                <IcBaselinePeople />
            </div>
            <div class="title">Friends</div>
            <div class="actions">
                <Button nobg compact onClick={() => (filter = Filter.Online)}>
                    <div class="tab-button" class:active={filter == Filter.Online}>
                        <span>Online</span>
                        <div class="indicator">5</div>
                    </div>
                </Button>
                <Button nobg compact onClick={() => (filter = Filter.All)}>
                    <div class="tab-button" class:active={filter == Filter.All}>
                        <span>All</span>
                        <div class="indicator">13</div>
                    </div>
                </Button>
                <Button nobg compact onClick={() => (filter = Filter.Pending)}>
                    <div
                        class="tab-button"
                        class:active={filter == Filter.Pending}
                    >
                        <span>Pending</span>
                        <div class="indicator red">1</div>
                    </div>
                </Button>
                <Button nobg compact onClick={() => (filter = Filter.Blocked)}>
                    <div
                        class="tab-button"
                        class:active={filter == Filter.Blocked}
                    >
                        <span>Blocked</span>
                    </div>
                </Button>
                <Button green nobg compact>
                    <div class="tab-button add-friend">
                        <IcRoundPersonAdd /><span>Add Friend</span>
                    </div>
                </Button>
            </div>
        </div>
    </div>
{:else}
    <MessageList
        channel={{
            id: "dm",
            name: "Direct Messages",
            permissions: null,
            type: "text",
        }}
    />
{/if}

<!-- <div class="lonely">
    <div class="lonely-icon">
        <IconParkOutlineSleepOne />
    </div>
    <div>*crickets*</div>
</div> -->

<style>
    .friends-page {
        display: block;
        height: 100%;
        width: 100%;
    }

    .head {
        min-height: 48px;
        display: flex;
        align-items: center;

        background-color: var(--bg-0);
        box-shadow: 0px 2px 3px 0 rgba(0, 0, 0, 0.3);
        z-index: 1;

        padding-left: 18px;
        gap: 10px;

        flex-wrap: wrap;
    }

    .icon {
        line-height: 0;
        color: var(--text-color);
    }

    .title {
        line-height: 0;
        font-weight: 600;
        margin-right: 20px;
    }

    .actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
    }

    .tab-button {
        color: var(--gray);
        padding: 8px 12px;
        border-radius: 6px;

        transition: background-color 0.1s ease-in-out;
    }

    .tab-button:hover {
        background-color: var(--channel-hover-bg);
    }

    .tab-button.active {
        color: var(--text-color);
        background-color: var(--channel-current-bg);
    }

    .add-friend {
        line-height: 0;
        display: flex;
        align-items: center;
        background-color: var(--green-transparent);
        color: var(--green);
        gap: 8px;
    }

    .add-friend:hover {
        background-color: var(--green-transparent);
    }

    .indicator {
        display: inline-block;
        margin-left: 5px;
        color: var(--disabled-text);
    }

    .indicator.red {
        color: var(--text-color);
        background-color: var(--red);
        border-radius: 9px;
        min-width: 18px;
        height: 18px;
        padding-inline: 2px;
        line-height: 18px;
    }

    .tab-button.active > .indicator {
        color: var(--gray-2);
    }
</style>
