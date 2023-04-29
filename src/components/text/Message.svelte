<script lang="ts">
    export let message: any;
    export let detailed: boolean = true;
</script>

<div class="message" class:detailed>
    {#if detailed}
        <img class="avatar" src={message.author.avatar} alt="avatar" />
        <div class="header">
            {message.author.username.split("#")[0]} <span class="time">{message.created_at}</span>
        </div>
    {/if}
    <div class="content">{message.content}</div>
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
        font-weight: 500;
        line-height: 1.375rem;
        margin-top: -1px;
        color: var(--header-primary);
        vertical-align: baseline;
        position: relative;
        overflow: hidden;
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
        color: #949BA4;
    }
</style>
