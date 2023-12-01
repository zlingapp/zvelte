<script lang="ts">
    import { editingThemeId, themes } from "src/lib/stores";

    import Modal from "src/components/base/Modal.svelte";
    import type { Theme } from "src/lib/theme";

    $: currentTheme = $themes.find((x) => x.id == $editingThemeId);

    function onTextareaInput(event: any) {
        themes.update((themesArray: Theme[]) => {
            const themeIndex = themesArray.findIndex(
                (theme) => theme.id == $editingThemeId
            );

            themesArray[themeIndex].style = (event.target as HTMLInputElement).value;

            return themesArray;
        });
    }
</script>

<Modal
    show={$editingThemeId != null}
    draggable
    onClose={() => {
        $editingThemeId = null;
    }}
    dimmed={false}
>
    <svelte:fragment slot="title"
        >Style Editor: {currentTheme?.name}</svelte:fragment
    >
    <svelte:fragment slot="content">
        <div style="color: var(--green); margin-bottom: 5px;">
            Your changes are saved automatically.
        </div>
        {#if !currentTheme?.enabled}
            <div style="color: var(--yellow); margin-bottom: 5px;">
                Warning: This theme is not currently enabled!
            </div>
        {/if}
        <textarea
            spellcheck="false"
            class="theme-edit-area"
            value={currentTheme?.style}
            on:input={onTextareaInput}
        />
    </svelte:fragment>
</Modal>

<style>
    textarea {
        width: 500px;
        height: 500px;
        color: var(--text-color);
        border: none;
        border-radius: 4px;
        background-color: var(--bg-1);
        resize: none;
        padding: 8px 10px;
        font-family: monospace;
    }
    textarea:focus {
        outline: none;
    }
</style>