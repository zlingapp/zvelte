<script lang="ts">
    export let url: string;
    export let status: "online" | "offline" | "idle" | "dnd";
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<div class="avatar">
    <img src={url} />
    {#if status != "offline"}
        <div class="status {status}" />
    {/if}
</div>

<style>
    img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        box-sizing: border-box;
        object-fit: cover;
    }

    .avatar {
        position: relative;
        width: 32px;
        height: 32px;
    }

    .status {
        position: absolute;
        right: 0;
        bottom: 0;

        width: 9px;
        height: 8px;
        
        border-radius: 50%;
        box-sizing: content-box;
        outline: 4px solid var(--bg-1);
    }

    .online {
        background-color: var(--green);
    }

    .offline {
        background-color: var(--gray);
    }

    .idle {
        background-color: var(--yellow);
    }

    .dnd {
        background-color: var(--red);
    }
</style>

