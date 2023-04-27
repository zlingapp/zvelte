<script lang="ts">
    import MajesticonsHashtagLine from '~icons/majesticons/hashtag-line'

    export let name: string = "Text Channel";
    export let onClick: () => void = () => {};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="channel" on:click={onClick}>
    <p class="channel-name"><MajesticonsHashtagLine /><span>{name}</span></p>
</div>

<style>
    .channel {
        color: #888b8f;
        padding: 6px 0;
        cursor: pointer;
        border-radius: 6px;
        user-select: none;
    }

    .channel-name {
        padding-left: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .channel:hover {
        background-color: #404249;
        color: #fff;
    }
</style>
