<script lang="ts">
    import { urlRelativeToApiBase } from "src/lib/auth";

    export let url: string;
    export let status: "online" | "offline" | "idle" | "dnd";
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<div class="avatar">
    <img src={urlRelativeToApiBase(url).toString()} />
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
        right: 1px;
        bottom: 1px;

        width: 8px;
        height: 8px;
        
        border-radius: 4px;
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

