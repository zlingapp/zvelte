<script lang="ts">
    export let green: boolean = false;
    export let danger: boolean = false;

    export let onClick = () => {};
</script>

<button class:green class:danger on:click={onClick}>
    <slot />
</button>

<style>
    button {
        padding: 12px 25px;
        margin: 0;
        border: none;
        border-radius: 6px;
        color: inherit;
        font-weight: 600;
        background-color: var(--bg-2);
        word-wrap: break-word;
        overflow: hidden;
        cursor: pointer;
    }

    .green {
        background-color: #00925f;
    }

    .danger {
        background-color: var(--red);
    }
</style>