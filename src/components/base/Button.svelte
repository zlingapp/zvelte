<script lang="ts">
    export let green: boolean = false;
    export let danger: boolean = false;
    export let outline: boolean = false;
    export let grow: boolean = false;
    export let accent: boolean = false;
    export let disabled: boolean = false;
    export let nobg: boolean = false;
    export let compact: boolean = false;

    export let onClick = () => {};
</script>

<button
    {disabled}
    class:grow
    class:green
    class:danger
    class:outline
    class:accent
    class:disabled
    class:nobg
    class:compact
    on:click={onClick}><slot /></button
>

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

    .accent {
        background-color: var(--accent-color);
    }

    .grow {
        flex-grow: 1;
    }

    .disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    button:hover {
        filter: brightness(1.2);
    }

    .danger.nobg {
        background-color: transparent;
        color: var(--red);
    }

    .compact {
        padding: 4px;
    }
</style>
