<script lang="ts">
    import { showInErrorModal } from "../../lib/stores";
    import Button from "../base/Button.svelte";

    import Modal from "../base/Modal.svelte";

    function onClose() {
        showInErrorModal.set(null);
    }
</script>

<Modal
    show={$showInErrorModal != null}
    {onClose}
>
    <span slot="title" style="min-width: 250px; color: var(--red);"
        >AHHHHHHH!!!!!!</span
    >
    <svelte:fragment slot="content"
        >Something went wrong!<br />
        <div class="error">
            Error: {$showInErrorModal}
        </div></svelte:fragment
    >
    <svelte:fragment slot="actions">
        <Button grow onClick={onClose}
            >Oh, alright.</Button
        >
        <Button grow danger onClick={onClose}
            >DETONATE</Button
        >
    </svelte:fragment>
</Modal>

<style>
    .error {
        font-family: monospace;
        margin-top: 8px;
        padding: 5px 10px;
        border-radius: 4px;
        color: orange;
        background-color: rgba(0, 0, 0, 0.5);
    }
</style>
