<script>
    export let value = false;
    export let tooltip = "";

    function handleClick(_) {
        value = !value;
    }
</script>

<div class="slider">
    <button
        role="switch"
        aria-checked={value}
        title={tooltip}
        aria-labelledby={`Switch-${tooltip}`}
        on:click={handleClick}
    />
</div>

<style>
    .slider {
        display: flex;
        align-items: center;
    }

    .slider button {
        cursor: pointer;
        width: 3em;
        height: 1.6em;
        position: relative;
        margin: 0 0 0 0.5em;
        background: var(--gray);
        border: none;
        border-radius: 1.5em;
    }

    .slider button::before {
        content: "";
        position: absolute;
        width: 1.3em;
        height: 1.3em;
        background: #fff;
        top: 0.13em;
        right: 1.5em;
        transition: transform 0.1s, width 0.1s;
        border-radius: 1em;
    }

    .slider button[aria-checked="true"] {
        background-color: var(--green);
    }

    .slider button[aria-checked="true"]::before {
        transform: translateX(1.3em);
    }

    .slider button:active:hover::before {
        width: 1.7em;
        border-radius: 1em;
    }

    .slider button[aria-checked="false"]:active:hover::before {
        transform: translateX(0.47em);
    }
</style>
