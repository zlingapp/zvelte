<script lang="ts">
    export let name: string;
</script>

<div class="voice-member">
    <div class="avatar"></div>
    <pre class="name">{name}</pre>
</div>

<style>
    .voice-member {
        display: flex;
        align-items: center;
        padding: 4px 8px;
        gap: 8px;
    }
    .avatar {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: gray;
    }
</style>