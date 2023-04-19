<script lang="ts">
    export let text: string;
</script>

<div class="has-tooltip">
    <slot />
    <span class="tooltip">{text}</span>
</div>

<style>
    .has-tooltip {
        position: relative;
    }

    .tooltip {
        opacity: 0;
        transition: opacity ease-in 0.06s;

        background-color: var(--bg-3);
        color: #fff;

        text-align: center;

        border-radius: 6px;
        padding: 8px 12px;

        position: absolute;
        top: -48px;
        left: 50%;
        transform: translate(-50%, 0);
        width: max-content;

        /* Position the tooltip */
        z-index: 1;

        pointer-events: none;
        user-select: none;
    }

    .tooltip::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: var(--bg-3) transparent transparent transparent;
    }

    .has-tooltip:hover > .tooltip {
        opacity: 1;
    }
</style>
