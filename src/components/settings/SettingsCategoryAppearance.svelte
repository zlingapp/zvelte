<script lang="ts">
    import { themeToFileString, type Theme } from "../../lib/theme";
    import { defaultTheme } from "../../lib/theme";
    import { themes, localUser } from "../../lib/stores";
    import Button from "../base/Button.svelte";
    import ZondiconsDownload from "~icons/zondicons/download";
    import ZondiconsTrash from "~icons/zondicons/trash";
    import ZondiconsEditPencil from "~icons/zondicons/edit-pencil";
    import ZondiconsAddSolid from "~icons/zondicons/add-solid";
    import Switch from "../base/Switch.svelte";
    import Modal from "../base/Modal.svelte";
    import PreviewArea from "../preview/PreviewArea.svelte";

    let currentThemeId = null;
    let isEditModalShowing = false;
    function currentTheme() {
        // Read-only
        return $themes.find((x) => x.id == currentThemeId);
    }
    function downloadTheme(t: Theme) {
        var file = new Blob([themeToFileString(t)], { type: "text/css" });
        var link = document.createElement("a");
        var urlObject = URL.createObjectURL(file);
        link.download = t.name + ".css";
        link.href = urlObject;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(urlObject);
    }
    function deleteTheme(t: Theme) {
        themes.update((x) => x.filter((y) => y != t));
    }
    function createTheme() {
        themes.update((x) =>
            x.concat([
                {
                    id: Math.floor(Math.random() * 1000),
                    name: "New Theme",
                    author: $localUser.name.split("#")[0],
                    enabled: false,
                    style: defaultTheme.style,
                },
            ])
        );
    }
</script>

<h2 style="margin:0;">Appearance</h2>
<h3>Preview</h3>
<PreviewArea />

<Modal
    bind:show={isEditModalShowing}
    draggable
    onClose={() => {
        currentThemeId == null;
        isEditModalShowing = false;
    }}
    dimmed={false}
>
    <svelte:fragment slot="title">Stylesheet Editor</svelte:fragment>
    <svelte:fragment slot="content">
        <p>
            Editing {currentTheme().name}. Your changes are saved automatically.
        </p>
        <!-- Hello type warning -->
        <textarea
            spellcheck="false"
            class="theme-edit-area"
            value={currentTheme().style}
            on:input={(event) => {
                themes.update((x) => {
                    x[x.findIndex((y) => y.id == currentThemeId)].style =
                        event.target.value;
                    return x;
                });
            }}
        />
    </svelte:fragment>
</Modal>

<h3>Saved Themes</h3>
<div class="theme-list">
    <div class="theme-entry">
        <div class="theme-title">
            <p>{defaultTheme.name}</p>
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label>{defaultTheme.author}</label>
        </div>
        <div class="theme-entry-buttons">
            <Button
                compact
                tooltip={`Download default.css`}
                onClick={() => {
                    downloadTheme(defaultTheme);
                }}><ZondiconsDownload height="14px" width="14px" /></Button
            >
        </div>
    </div>
    {#each $themes as theme}
        <div class="theme-entry">
            <div class="theme-title">
                <p>{theme.name}</p>
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label>{theme.author}</label>
            </div>
            <div class="theme-entry-buttons">
                <Button
                    compact
                    tooltip={`Download ${theme.name}.css`}
                    onClick={() => {
                        downloadTheme(theme);
                    }}
                >
                    <ZondiconsDownload height="14px" width="14px" />
                </Button>
                <Button
                    compact
                    tooltip={`Edit ${theme.name}`}
                    onClick={() => {
                        currentThemeId = theme.id;
                        isEditModalShowing = true;
                    }}
                >
                    <ZondiconsEditPencil height="14px" width="14px" />
                </Button>
                <Button
                    compact
                    tooltip={`Delete ${theme.name}`}
                    onClick={() => {
                        deleteTheme(theme);
                    }}
                >
                    <ZondiconsTrash height="14px" width="14px" />
                </Button>
                <Switch
                    bind:value={theme.enabled}
                    tooltip={`${theme.enabled ? `Disable` : `Enable`} ${
                        theme.name
                    }`}
                />
            </div>
        </div>
    {/each}
    <!-- svelte-ignore a11y-click-events-have-key-events-->
    <div class="create-theme theme-entry" on:click={createTheme}>
        <ZondiconsAddSolid
            width="14px"
            height="14px"
            style="padding-right:5px"
        />
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label style="color:var(--green)">Create Theme</label>
    </div>
</div>

<style>
    h3 {
        margin: 0px;
        padding-top: 20px;
    }
    *.create-theme {
        color: var(--green);
    }
    .create-theme {
        justify-content: unset !important;
        align-items: center;
    }
    .theme-entry {
        display: flex;
        justify-content: space-between;
        width: 500px;
        background-color: var(--bg-1);
        padding: 5px;
        border-radius: 4px;
        padding-left: 25px;
    }
    .theme-entry-buttons {
        display: inline-flex;
        align-items: center;
    }
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

    .theme-list {
        display: flex;
        gap: 5px;
        max-width: 500px;
        flex-wrap: wrap;
    }
</style>
