<script lang="ts">
    export let green: boolean = false;
    export let danger: boolean = false;
    export let outline: boolean = false;
    export let grow: boolean = false;

    export let onClick = () => {};
</script>

<button class:grow class:green class:danger class:outline on:click={onClick}><slot /></button>

<style>
    button {
        padding: 12px 25px;
        margin: 0;
        border: none;
        border-radius: 6px;
        color: inherit;
        font-weight: 600;
        background-color: var(--bg-1);
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

    .outline {
        border: 2px solid white;
    }

    .grow {
        flex-grow: 1;
    }

    button:hover {
        filter: brightness(1.2);
    }
</style>