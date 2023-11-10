<script lang="ts">
    import Button from "../base/Button.svelte";
    import MaterialSymbolsEmojiPeopleRounded from "~icons/material-symbols/emoji-people-rounded";
</script>

<div class="home-sidebar">
    <Button left compact>
        <div class="home-category">
            <MaterialSymbolsEmojiPeopleRounded />
            <span>Friends</span>
        </div>
    </Button>
</div>

<style>
    .home-sidebar {
        min-width: 72px;
        display: flex;
        flex-direction: column;
        padding: 16px;
        gap: 12px;
    }

    .home-category {
        font-family: var(--font);
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 500;
        font-size: 16px;
        padding-inline: 10px;
        padding-block: 5px;
        color: var(--gray);
    }
</style>
