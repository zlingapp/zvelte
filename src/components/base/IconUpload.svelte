<script lang="ts">
    import Button from "./Button.svelte";


</script>
<div class="icon-upload">
    <div class="icon">
    </div>
    <div class="upload">
        <Button green>Browse</Button>
        <div>Maximum 25MB,<br>at least 64x64</div>
    </div>
</div>

<style>
    .icon-upload {
        width: 100%;
        min-height: 100px;
        border-radius: 6px;

        display: flex;
        align-items: center;
        justify-content: center;
        gap: 25px
    }

    .icon {
        width: 64px;
        height: 64px;
        background: var(--bg-2);
        border-radius: 50%;
    }

    .upload {
        max-width: 150px;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
</style>
