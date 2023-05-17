<script lang="ts">
    import Button from "./base/Button.svelte";
</script>
<div class="header-warning">
    <p class="warning">
        <strong>Warning!</strong> You're not connected to Zling properly right now. You might not
        receive messages, see changes to servers, channels, or roles in real
        time.
    </p>
    <Button danger outline onClick={() => location.reload()}>
        Reload
    </Button>
</div>

<style>
    .header-warning {
        background-color: var(--red);
        z-index: 3;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .warning {
        color: var(--white);
        font-size: 20px;
        padding: 12px;
    }
</style>
