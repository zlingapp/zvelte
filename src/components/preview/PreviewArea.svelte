<script lang="ts">
    import dayjs from "dayjs";
    import DummyMessage from "src/components/preview/DummyMessage.svelte";
    import DummyMessageCaret from "src/components/preview/DummyMessageCaret.svelte";
</script>

<div class="preview">
    <div class="preview-messages">
        <DummyMessage
            detailed
            time={dayjs().subtract(5, "minute")}
            message="This is a test message"
        />
        <DummyMessage
            time={dayjs().subtract(1, "minute")}
            message="This is another test message"
        />
        <DummyMessage
            time={dayjs()}
            message="The quick brown fox jumps over the lazy dog"
        />
    </div>
    <DummyMessageCaret />
</div>

<style>
    .preview-messages {
        box-sizing: border-box;
        padding-block-end: 20px;
    }
</style>
