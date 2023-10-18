<script lang="ts">
    import type {theme} from "../../lib/theme";
    import {defaultTheme} from "../../lib/theme"
    import {currentTheme, themes} from "../../lib/stores";
    import Button from "../base/Button.svelte";
    import ZondiconsSaveDisk from "~icons/zondicons/save-disk";
    import ZondiconsRefreshIcon from "~icons/zondicons/refresh";
    import Modal from "../base/Modal.svelte";

    let saved=false;
    let isSaveModalOpen = false;
    let saveName = "";
    let nameError = false;
    function save() {
        if (saveName == "" || $themes.map((x)=>x.name).includes(saveName)) {
            nameError = true;
            return;
        }
        themes.update((x)=>x.concat([{"name":saveName,"style":$currentTheme}]))
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
    let setTheme: theme;
    function loadOther() {
        if (setTheme == null) {
            isLoadWarningOpen = false;
            return;
        }
        if (!saved) {
            isLoadWarningOpen=true;
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
    <div class="theme-edit-buttons">
    <Button compact outline tooltip="Save theme" onClick={()=>(isSaveModalOpen=true)}>
        <ZondiconsSaveDisk height=14px width=14px/>
    </Button>
    <Button compact outline tooltip="Reset to default theme" onClick={restoreDefault}>
        <ZondiconsRefreshIcon height=14px width=14px/>
    </Button>
    </div>
</div>
<textarea on:input={()=>{saved=false}} spellcheck="false" class="theme-edit-area" bind:value={$currentTheme}></textarea>

{#if $themes.length != 0}
<h3>Saved Themes</h3>
<div class="theme-list">
    {#each $themes as _theme}
        <Button outline onClick={()=>{setTheme=_theme;loadOther()}}>{_theme.name}</Button>
    {/each}
</div>
{/if}

<!-- svelte-ignore a11y-label-has-associated-control -->
<Modal bind:show={isSaveModalOpen} onClose={clear}>
    <svelte:fragment slot="title">Save a Theme</svelte:fragment>

    <svelte:fragment slot="content">
        <label>Theme Name</label>
        <input type="text" bind:value={saveName} placeholder="New Theme"/>
        {#if nameError}
        <label style="color: var(--red)">Invalid or existing theme name</label>
        {/if}
    </svelte:fragment>

    <svelte:fragment slot="actions">
        <Button green grow onClick={save}>Save Theme</Button>
        <Button grow onClick={clear}>Nevermind</Button>
    </svelte:fragment>
</Modal>

<!-- svelte-ignore a11y-label-has-associated-control -->
<Modal bind:show={isOverrideWarningOpen} onClose={()=>(isOverrideWarningOpen=false)}>
    <svelte:fragment slot="title">Confirm Reset</svelte:fragment>
    <svelte:fragment slot="content">Are you sure you want to restore the default theme? 
        <br>This will override your current theme! <br>This action is irreversible.</svelte:fragment>
    <svelte:fragment slot="actions">
        <Button onClick={()=>{saved=true;restoreDefault()}}>Yes, do it!</Button>
        <Button green onClick={()=>(isOverrideWarningOpen=false)}>Take me back</Button>
    </svelte:fragment>
</Modal>

<!-- svelte-ignore a11y-label-has-associated-control -->
<Modal bind:show={isLoadWarningOpen} onClose={()=>{isLoadWarningOpen=false}}>
    <svelte:fragment slot="title">Confirm Load</svelte:fragment> 
    <svelte:fragment slot="content">Are you sure you want to load that theme? 
        <br>This will override your current theme! <br>This action is irreversible.</svelte:fragment>
    <svelte:fragment slot="actions">
        <Button onClick={()=>{saved=true;loadOther()}}>Yes, do it!</Button>
        <Button green onClick={()=>{isLoadWarningOpen=false;setTheme=null;}}>Take me back</Button>
    </svelte:fragment> 
</Modal>

<style>
    h3 {
        margin-bottom: 2px;
    }
    textarea {
        width: 90%;
        height: 500px;
        background: var(--bg-0);
        border: 2px solid var(--text-color);
        border-radius: 4px;
        background-color: var(--bg-0);
        resize: none;
    }
    .theme-edit-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0;
        width: 90%;
    }
</style>