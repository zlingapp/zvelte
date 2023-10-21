<script lang="ts">
    export let text: string = "";
    export let selectable: boolean = false;

    export let direction: "top" | "right" = "top";
</script>

<div class="has-tooltip">
    <slot />
    <span
        class="tooltip"
        class:top={direction == "top"}
        class:right={direction == "right"}
        class:selectable
    >
        {text}
        <slot name="text" />
    </span>
</div>

<style>
    .has-tooltip {
        position: relative;
        display: inherit;
    }

    .tooltip {
        opacity: 0;
        transition: opacity ease-in 0.06s;

        background-color: var(--tooltip-bg);
        color: var(--tooltip-fg);

        text-align: center;

        border-radius: 6px;
        padding: 8px 12px;

        position: absolute;
        width: max-content;

        /* Position the tooltip */
        z-index: 1;

        pointer-events: none;
        user-select: none;
    }

    .tooltip.top {
        bottom: 40px;
        left: 50%;
        transform: translate(-50%, 0);
    }

    .tooltip.top::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: black transparent transparent transparent;
    }

    .tooltip.right {
        left: 100%;
        top: calc(50%);
        transform: translate(10px, -50%);
    }

    .tooltip.right::after {
        content: "";
        position: absolute;
        top: 50%;
        right: 100%; /* To the left of the tooltip */
        margin-top: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: transparent black transparent transparent;
    }

    .has-tooltip:hover > .tooltip {
        opacity: 1;
    }

    .has-tooltip:hover > .tooltip.selectable {
        pointer-events: initial;
        user-select: initial;
    }
</style>
