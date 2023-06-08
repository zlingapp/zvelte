<script lang="ts">
    import SvgSpinnersBarsRotateFade from "~icons/svg-spinners/bars-rotate-fade";
    import MaterialSymbolsCloseRounded from "~icons/material-symbols/close-rounded";
    import { userSettingsOpen } from "../../lib/stores";
    import { fade, fly } from "svelte/transition";
    import Button from "../base/Button.svelte";
    import SettingsCategoryAccount from "./SettingsCategoryAccount.svelte";

    let category = "my-account";
</script>

<div class="settings" transition:fly={{ duration: 100, y: 10 }}>
    <div class="categories">
        <div class="categories-container">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label>User Settings</label>
            <button class="category">My Account</button>
            <button class="category">Privacy & Safety</button>
            <button class="category">Devices</button>
            <button class="category">Connections</button>
            <button class="category">Friend Requests</button>
            <div class="divider"></div>
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label>App Settings</label>
            <button class="category">Appearance</button>
            <button class="category">Voice & Video</button>
            <button class="category">Text & Images</button>
            <button class="category">Notifications</button>
            <button class="category">Keybinds</button>
            <button class="category">Language</button>
            <button class="category">Advanced</button>
        </div>
    </div>
    <div class="category-content">
        <SettingsCategoryAccount />
    </div>
    <div class="close-group">
        <button class="close" on:click={() => $userSettingsOpen = false}>
            <MaterialSymbolsCloseRounded />
        </button>
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label>ESC</label>
    </div>
</div>

<style>
    .settings {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        background-color: var(--bg-0);
        z-index: 1000;

        display: flex;
    }

    .categories {
        position: relative;
        background-color: var(--bg-1);
        width: 670px;
        height: 100%;
        box-sizing: border-box;
    }

    .categories-container {
        position: absolute;
        right: 0;
        width: 192px;

        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 60px 20px 60px 20px;

        color: #B5BAC1;
        user-select: none;
    }

    .categories-container > label {
        color: inherit;
        padding: 6px 10px;
    }

    .category {
        background: none;
        border: none;
        color: inherit;
        font: inherit;
        cursor: pointer;
        padding: 6px 10px;
        margin-bottom: 2px;
        width: 100%;
        text-align: left;

        border-radius: 5px;
    }

    .category:hover {
        color: #dadfe7;
        background-color: #36373D;
    }

    .category-content {
        padding: 60px 20px 60px 40px;
    }

    .category:active {
        color: var(--text-color);
        background-color: #3B3D44;
    }

    .divider {
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        width: calc(100% - 10px);
        margin-top: 5px;
        margin-bottom: 7px;
    }

    .close-group {
        position: absolute;
        top: 75px;
        right: 100px;

        display: flex;
        text-align: center;
        flex-direction: column;
        gap: 16px;

        user-select: none;
    }

    .close {
        padding: 4px;
        border: 0;
        border: 2px solid var(--gray);
        border-radius: 50%;

        background: none;

        color: var(--gray);
        line-height: 0;

        transform: scale(1.5);

        cursor: pointer;

        width: fit-content;
        height: fit-content;
    }

    .close:hover {
        color: var(--text-color);
        outline: 3px solid rgba(255, 255, 255, 0.1);
    }
</style>
