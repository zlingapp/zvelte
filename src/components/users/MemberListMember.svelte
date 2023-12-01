<script lang="ts">
    import type { PublicUserInfo } from "../../lib/channel";
    import Avatar from "./Avatar.svelte";

    export let member: PublicUserInfo;
    export let fullUsername = false;

    $: name = fullUsername ? member.username : member.username.split("#")[0];
</script>

<div class="member">
    <Avatar url={member.avatar} status="online" />
    <div class="name" class:fullUsername>{name}</div>
</div>

<style>
    .member {
        display: flex;
        gap: 10px;
        align-items: center;
        cursor: pointer;
    }

    .name {
        font-weight: bold;
    }
</style>