<script lang="ts">
    import {
        themeToFileString,
        fileStringToTheme,
        type Theme,
    } from "../../lib/theme";
    import { defaultTheme } from "../../lib/theme";
    import { themes, localUser, editingThemeId } from "../../lib/stores";
    import Button from "../base/Button.svelte";
    import ZondiconsDownload from "~icons/zondicons/download";
    import ZondiconsTrash from "~icons/zondicons/trash";
    import ZondiconsEditPencil from "~icons/zondicons/edit-pencil";
    import ZondiconsAddSolid from "~icons/zondicons/add-solid";
    import Switch from "../base/Switch.svelte";
    import PreviewArea from "../preview/PreviewArea.svelte";

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
    var editingName: Theme = null;
    function updateThemeName(t: Theme, event) {
        themes.update((x) => {
            x.find((y) => y == t)["name"] = event.target.value;
            return x;
        });
    }
    function validateThemeName(id: Number) {
        themes.update((x) => {
            let t = x.find((y) => y.id == id);
            t.name = t.name.trim() == "" ? "New Theme" : t.name.trim();
            return x;
        });
    }
    var file = null;
    var invalidFile = false;
    async function submitImport() {
        let text = await file[0].text();
        let t = fileStringToTheme(text);
        if (t === null) {
            invalidFile = true;
            file = null;
        } else {
            invalidFile = false;
            file = null;
            themes.update((x) => x.concat([t]));
        }
    }
</script>

<h2 style="margin:0;">Appearance</h2>
<h3>Preview</h3>
<PreviewArea />

<h3>Saved Themes</h3>
<div class="theme-list">
    <div class="theme-entry">
        <div>
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
                <p>
                    <input
                        type="text"
                        maxlength="24"
                        id={theme.id.toString()}
                        class="theme-title {editingName == theme
                            ? 'editable'
                            : ''}"
                        readonly={editingName != theme}
                        on:dblclick={(_) => {
                            editingName = theme;
                        }}
                        on:input={(event) => {
                            updateThemeName(theme, event);
                        }}
                        on:keypress={(event) => {
                            if (event.key == "Enter") {
                                validateThemeName(theme.id);
                                editingName = null;
                            }
                        }}
                        value={theme.name}
                    />
                </p>
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
                        $editingThemeId = theme.id;
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
        <label style="color: var(--green)">Create Theme</label>
    </div>
    <div class="import-theme theme-entry">
        <ZondiconsAddSolid
            width="14px"
            height="14px"
            style="padding-right:5px"
        />
        <input
            type="file"
            bind:files={file}
            on:change={submitImport}
            accept="text/css"
            id="import"
            style="display: none"
        />
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label for="import" style="color: var(--yellow); cursor: pointer;"
            >Import Theme</label
        >
        <!-- svelte-ignore a11y-label-has-associated-control -->
        {#if invalidFile}<label style="color: var(--red); padding-left: 10px"
                >Invalid File</label
            >{/if}
    </div>
</div>
<svelte:window
    on:click={(event) => {
        if (editingName == null) return;
        if (event.target instanceof HTMLElement && !event.target.className.includes("editable")) {
            if (document.getElementsByClassName("editable").length != 0) {
                let id = parseInt(
                    document.getElementsByClassName("editable")[0].id
                );
                validateThemeName(id);
            }
            editingName = null;
        }
    }}
/>

<style>
    .theme-title {
        border: none;
        display: inline;
        font-family: inherit;
        font-size: inherit;
        padding: 0;
        margin: 0;
        width: auto;
        background: transparent;
    }
    .theme-title:read-only {
        user-select: none;
    }
    .theme-title:read-write {
        background-color: var(--bg-0);
        border: 1px solid var(--gray);
        border-radius: 2px;
    }
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
        cursor: pointer;
    }
    *.import-theme {
        color: var(--yellow);
    }
    .import-theme {
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

    .theme-list {
        display: flex;
        gap: 5px;
        max-width: 500px;
        flex-wrap: wrap;
    }
</style>
