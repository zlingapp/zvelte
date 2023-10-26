<script lang="ts">
    import { localUser } from "../../lib/stores";
    import Tooltip from "../base/Tooltip.svelte";;
    export let detailed = false;
    export let message = ""
    export let time = null;
    $: formattedTime = time.calendar(null, {
        sameDay: "[Today at] h:mm A",
        nextDay: "[Tomorrow at] h:mm A",
        nextWeek: "DD/MM/YYYY hh:mm: A",
        lastDay: "[Yesterday at] h:mm A",
        lastWeek: "DD/MM/YYYY hh:mm A",
        sameElse: "DD/MM/YYYY hh:mm A",
    });
</script>

    <div class="message" class:detailed>
        {#if detailed}
            <img class="avatar" src={$localUser.avatar} alt="avatar" />
            <div class="header">
                <span class="username">
                    {$localUser.name.split("#")[0]}
                </span>

                <span class="time"
                    ><Tooltip
                        direction="right"
                        text={time.format(
                            "DD/MM/YYYY HH:mm:ss G[M]T+0"
                        )}>{formattedTime}</Tooltip
                    ></span
                >
            </div>
        {/if}
        <div class="content">
            {message}
            {#if !detailed}
                <span class="time time-inline"
                    >{time.format("hh:mm A")}</span
                >
            {/if}
        </div>
    </div>

<style>
    .message {
        position: relative;
        /* min-height: 2.75rem; */
        padding-left: 72px;
        padding-top: 0.125rem;
        padding-bottom: 0.125rem;
        padding-right: 48px;
    }
    .detailed {
        margin-top: 1.0625rem;
    }
    .message:hover {
        background-color: var(--message-hover-bg);
    }

    .username {
        /* font-weight: 600; */
        margin-right: 3px;
    }

    .avatar {
        position: absolute;
        left: 16px;
        margin-top: calc(4px - 0.125rem);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
        cursor: pointer;
        user-select: none;
        flex: 0 0 auto;
    }
    .content {
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.375rem;
        margin-top: -1px;
        color: var(--text-color);
        vertical-align: baseline;
        position: relative;
        word-wrap: break-word;
        word-break: break-all;
    }

    .header {
        font-size: 1rem;
        font-weight: 500;
        line-height: 1.375rem;
        color: var(--header-primary);
        display: inline;
        vertical-align: baseline;
        position: relative;
        overflow: hidden;
    }

    .time {
        font-size: 0.75rem;
        line-height: 1.375rem;
        color:var(--gray);
        user-select: none;
    }

    .time-inline {
        position: absolute;
        left: 0;
        transform: translate(calc(-100% - 8px), 2px);
        opacity: 0;
    }

    .message:hover .time-inline {
        opacity: 1;
    }
</style>
