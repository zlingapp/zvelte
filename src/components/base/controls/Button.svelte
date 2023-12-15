<script lang="ts">
    export let green: boolean = false;
    export let danger: boolean = false;
    export let darker: boolean = false;
    export let outline: boolean = false;
    export let grow: boolean = false;
    export let accent: boolean = false;
    export let disabled: boolean = false;
    export let nobg: boolean = false;
    export let compact: boolean = false;
    export let left: boolean = false;
    export let tooltip: string = "";

    export let onClick = () => {};
    export let extraStyle = "";
</script>

<button
    {disabled}
    title={tooltip}
    class:grow
    class:green
    class:danger
    class:outline
    class:accent
    class:disabled
    class:nobg
    class:compact
    class:left
    class:darker
    style={extraStyle}
    on:click|stopPropagation={onClick}><slot /></button
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

        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;

        transition: all 100ms ease-in-out;
        box-shadow: 0 2px 6px rgba(0, 0, 0, .2);

        letter-spacing: 0.01em;
    }

    button:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, .2);
    }

    button:active {
        box-shadow: 0 1px 3px rgba(0, 0, 0, .2);
    }

    /* Colourings */
    .green {
        background-color: var(--green-btn);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 2px 6px rgba(0, 0, 0, .2);
    }

    .danger {
        background-color: var(--red);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 2px 6px rgba(0, 0, 0, .2);
    }

    .accent {
        background-color: var(--accent-color);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 2px 6px rgba(0, 0, 0, .2);
    }

    /* Lighting overrides */
    .green:hover, .danger:hover, .accent:hover {
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 2px 8px rgba(0, 0, 0, .2);
    }

    .green:active, .danger:active, .accent:active {
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 3px rgba(0, 0, 0, .2);
    }

    /* Outlined buttons */
    .outline {
        border: 2px solid rgba(255, 255, 255, 0.1);
        box-shadow: none;
    }

    .disabled {
        opacity: 0.5;
        cursor: not-allowed;
        box-shadow: none;
    }


    /* No Background */
    .nobg {
        background-color: transparent;
        box-shadow: none;
    }

    .nobg:hover, .nobg:active {
        box-shadow: none;
    }

    .danger.nobg {
        color: var(--red);
    }

    .green.nobg {
        color: var(--green);
    }

    /* Misc Transforms */
    .compact {
        padding: 4px;
    }

    .left {
        justify-content: left;
    }

    .grow {
        flex-grow: 1;
    }
</style>
