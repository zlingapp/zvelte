<script lang="ts">
    import Button from "./Button.svelte";
    import IcBaselineArrowForwardIos from "~icons/ic/baseline-arrow-forward-ios";

    export let open: boolean = false;
</script>

<div class="dropdown">
    <Button outline compact onClick={() => (open = !open)}>
        <div class="dropdown-arrow" class:open>
            <IcBaselineArrowForwardIos
                font-size="16px"
                style="line-height: 0; transform: translateY(2px);"
            />
        </div>
    </Button>
</div>

<style>
    .dropdown {
        position: relative;
    }

    .dropdown-arrow {
        transition: transform 0.15s ease-out;
    }

    .open {
        transform: rotate(90deg);
    }
</style>
