<script>
    export let value = true;
    export let tooltip = "";

    function handleClick(event) {
        const target = event.target;

        const state = target.getAttribute("aria-checked");

        value = state === "true" ? false : true;

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
        width: 3em;
        height: 1.6em;
        position: relative;
        margin: 0 0 0 0.5em;
        background: var(--gray);
        border: none;
    }

    .slider button::before {
        content: "";
        position: absolute;
        width: 1.3em;
        height: 1.3em;
        background: #fff;
        top: 0.13em;
        right: 1.5em;
        transition: transform 0.3s;
    }

    .slider button[aria-checked="true"] {
        background-color: var(--accent-color);
    }

    .slider button[aria-checked="true"]::before {
        transform: translateX(1.3em);
        transition: transform 0.3s;
    }

    .slider button:focus {
        box-shadow: 0 0px 0px 1px var(--accent-color);
    }

    .slider button {
        border-radius: 1.5em;
    }

    .slider button::before {
        border-radius: 100%;
    }

    .slider button:focus {
        box-shadow: 0 0px 8px var(--accent-color);
        border-radius: 1.5em;
    }
</style>
