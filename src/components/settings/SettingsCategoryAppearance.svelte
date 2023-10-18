<script lang="ts">
    import type { Theme } from "../../lib/theme";
    import { defaultTheme } from "../../lib/theme";
    import { currentTheme, themes } from "../../lib/stores";
    import Button from "../base/Button.svelte";
    import ZondiconsSaveDisk from "~icons/zondicons/save-disk";
    import ZondiconsRefreshIcon from "~icons/zondicons/refresh";
    import Modal from "../base/Modal.svelte";

    let saved = false;
    let isSaveModalOpen = false;
    let saveName = "";
    let nameError = false;

    function save() {
        if (saveName == "") {
            nameError = true;
            return;
        }

        themes.update((x) =>
            x.concat([{ name: saveName, style: $currentTheme }])
        );
        saved = true;
        clear();
    }
    function clear() {
        saveName = "";
        nameError = false;
        isSaveModalOpen = false;
    }

    let isOverrideWarningOpen = false;
    function restoreDefault() {
        if (!saved) {
            isOverrideWarningOpen = true;
            return;
        }
        isOverrideWarningOpen = false;
        $currentTheme = defaultTheme;
    }
    let isLoadWarningOpen = false;
    let setTheme: Theme;
    function loadOther() {
        if (setTheme == null) {
            isLoadWarningOpen = false;
            return;
        }
        if (!saved) {
            isLoadWarningOpen = true;
            return;
        }
        isLoadWarningOpen = false;
        currentTheme.set(setTheme.style);
        setTheme = null;
    }
</script>

<h2>Appearance</h2>
<div class="theme-edit-header">
    <h3>Style Editor</h3>
    {#if saved}
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label style="color: var(--green);">Saved</label>
    {/if}
    <span style="flex-grow: 1;" />
    <div class="theme-edit-buttons">
        <Button
            compact
            tooltip="Save theme"
            onClick={() => (isSaveModalOpen = true)}
        >
            <ZondiconsSaveDisk height="14px" width="14px" />
        </Button>
        <Button
            compact
            tooltip="Reset to default theme"
            onClick={restoreDefault}
        >
            <ZondiconsRefreshIcon height="14px" width="14px" />
        </Button>
    </div>
</div>
<textarea
    on:input={() => {
        saved = false;
    }}
    spellcheck="false"
    class="theme-edit-area"
    bind:value={$currentTheme}
/>

{#if $themes.length != 0}
    <h3>Saved Themes</h3>
    <div class="theme-list">
        {#each $themes as _theme}
            <Button
                outline
                onClick={() => {
                    setTheme = _theme;
                    loadOther();
                }}>{_theme.name}</Button
            >
        {/each}
    </div>
{/if}

<!-- svelte-ignore a11y-label-has-associated-control -->
<Modal bind:show={isSaveModalOpen} onClose={clear}>
    <svelte:fragment slot="title">Save a Theme</svelte:fragment>

    <svelte:fragment slot="content">
        <label>Theme Name</label>
        <input type="text" bind:value={saveName} placeholder="New Theme" />
        {#if nameError}
            <label style="color: var(--red)"
                >Invalid or existing theme name</label
            >
        {/if}
    </svelte:fragment>

    <svelte:fragment slot="actions">
        <Button grow onClick={clear}>Nevermind</Button>
        <Button green grow onClick={save}>Save Theme</Button>
    </svelte:fragment>
</Modal>

<!-- svelte-ignore a11y-label-has-associated-control -->
<Modal
    bind:show={isOverrideWarningOpen}
    onClose={() => (isOverrideWarningOpen = false)}
>
    <svelte:fragment slot="title">Restore Default</svelte:fragment>
    <svelte:fragment slot="content"
        >Are you sure you want to restore the default theme?
        <br />This will override your current theme! <br />This action is
        irreversible.</svelte:fragment
    >
    <svelte:fragment slot="actions">
        <Button onClick={() => (isOverrideWarningOpen = false)}
            >Take me back</Button
        >
        <Button
            danger
            onClick={() => {
                saved = true;
                restoreDefault();
            }}>Restore</Button
        >
    </svelte:fragment>
</Modal>

<!-- svelte-ignore a11y-label-has-associated-control -->
<Modal
    bind:show={isLoadWarningOpen}
    onClose={() => {
        isLoadWarningOpen = false;
    }}
>
    <svelte:fragment slot="title">Confirm Load</svelte:fragment>
    <svelte:fragment slot="content"
        >Are you sure you want to load "{setTheme.name}"?
        <br />This will override your current theme! <br />This action is
        irreversible.</svelte:fragment
    >
    <svelte:fragment slot="actions">
        <Button
            onClick={() => {
                isLoadWarningOpen = false;
                setTheme = null;
            }}>Take me back</Button
        >
        <Button
            green
            onClick={() => {
                saved = true;
                loadOther();
            }}>Load</Button
        >
    </svelte:fragment>
</Modal>

<style>
    textarea {
        width: 100%;
        height: 500px;
        border: none;
        border-radius: 4px;
        background-color: var(--bg-1);
        resize: none;
        padding: 8px 10px;
    }

    textarea:active {
        outline: none;
    }
    .theme-edit-header {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 0;
    }

    .theme-edit-buttons {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0;
    }

    .theme-list {
        display: flex;
        gap: 5px;
        max-width: 500px;
        flex-wrap: wrap;
    }
</style>
