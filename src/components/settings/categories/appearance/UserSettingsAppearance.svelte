<script lang="ts">
    import Button from "src/components/base/controls/Button.svelte";
    import Switch from "src/components/base/controls/Switch.svelte";
    import PreviewArea from "src/components/settings/categories/appearance/preview/PreviewArea.svelte";
    import { editingThemeId, localUser, themes } from "src/lib/stores";
    import {
        defaultTheme,
        fileStringToTheme,
        themeToFileString,
        type Theme,
    } from "src/lib/theme";
    import { flip } from "svelte/animate";
    import IcBaselineFileOpen from "~icons/ic/baseline-file-open";
    import IcRoundPlus from "~icons/ic/round-plus";
    import ZondiconsDown from "~icons/zondicons/cheveron-down";
    import ZondiconsUp from "~icons/zondicons/cheveron-up";
    import ZondiconsDownload from "~icons/zondicons/download";
    import ZondiconsEditPencil from "~icons/zondicons/edit-pencil";
    import ZondiconsTrash from "~icons/zondicons/trash";

    // downloads a theme's css as a file
    function downloadTheme(t: Theme) {
        var file = new Blob([themeToFileString(t)], { type: "text/css" });
        var link = document.createElement("a");
        var urlObject = URL.createObjectURL(file);
        link.download = t.name + ".theme.css";
        link.href = urlObject;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(urlObject);
    }

    function deleteTheme(theme: Theme) {
        themes.update((arr: Theme[]) => arr.filter((item) => item != theme));
    }

    function createTheme() {
        themes.update((arr: Theme[]) =>
            arr.concat([
                {
                    id: Math.floor(Math.random() * 1000),
                    name: "Untitled Theme",
                    author: $localUser!.name.split("#")[0],
                    enabled: false,
                    style: defaultTheme.style,
                },
            ]),
        );
    }
    
    var editingTheme: Theme | null = null;

    function updateThemeName(theme: Theme, event: any) {
        themes.update((arr: Theme[]) => {
            let t = arr.find((item) => item == theme);
            if (t == null) return arr;

            t.name = event.target.value;
            return arr;
        });
    }

    function validateThemeName(id: Number) {
        themes.update((arr: Theme[]) => {
            let theme = arr.find((item) => item.id == id);
            if (theme == null) return arr;

            theme.name = theme.name.trim() == "" ? "New Theme" : theme.name.trim();
            return arr;
        });
    }

    var files: FileList | null = null;
    var invalidFile = false;
    var fileInput: HTMLInputElement;

    async function submitImport() {
        let text = await files![0].text();
        let theme = fileStringToTheme(text);
        files = null;

        if (theme === null) {
            invalidFile = true;
        } else {
            invalidFile = false;
            themes.update((arr: Theme[]) => arr.concat([ theme! ]));
        }
    }

    function moveUp(t: Theme) {
        let idx = $themes.findIndex((x) => x === t);
        let temp = $themes[idx - 1];
        $themes[idx - 1] = t;
        $themes[idx] = temp;
    }

    function moveDown(t: Theme) {
        let idx = $themes.findIndex((x) => x === t);
        let temp = $themes[idx + 1];
        $themes[idx + 1] = t;
        $themes[idx] = temp;
    }
</script>

<h2 style="margin:0;">Appearance</h2>
<h3>Preview</h3>
<PreviewArea />

<h3>Saved Themes</h3>
<div class="theme-list">
    <div class="theme-entry">
        <div style="theme-credit">
            <div class="default-theme-title">{defaultTheme.name}</div>
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <div class="theme-author">{defaultTheme.author}</div>
        </div>
        <div class="theme-entry-buttons">
            <Button
                compact
                nobg
                tooltip={`Download ${defaultTheme.name}.theme.css`}
                onClick={() => {
                    downloadTheme(defaultTheme);
                }}><ZondiconsDownload height="14px" width="14px" /></Button
            >
        </div>
    </div>
    {#each $themes as theme (theme.id)}
        <div class="theme-entry" animate:flip={{ duration: 200 }}>
            <div class="theme-left-items">
                {#if $themes.length > 1}
                    <div class="theme-arrows">
                        {#if $themes.findIndex((x) => x === theme) != 0}
                            <Button
                                compact
                                nobg
                                tooltip="Move {theme.name} up"
                                onClick={() => {
                                    moveUp(theme);
                                }}
                            >
                                <ZondiconsUp width="18px" height="18px" />
                            </Button>
                        {/if}
                        {#if $themes.findIndex((x) => x === theme) != $themes.length - 1}
                            <Button
                                compact
                                nobg
                                tooltip="Move {theme.name} down"
                                onClick={() => {
                                    moveDown(theme);
                                }}
                            >
                                <ZondiconsDown width="18px" height="18px" />
                            </Button>
                        {/if}
                    </div>
                {/if}
                <div class="theme-credit">
                    <input
                        type="text"
                        maxlength="24"
                        size="15"
                        id={theme.id.toString()}
                        class="theme-title"
                        class:editable={editingTheme == theme}
                        readonly={editingTheme != theme}
                        on:click={(_) => {
                            editingTheme = theme;
                        }}
                        on:input={(event) => {
                            updateThemeName(theme, event);
                        }}
                        on:keypress={(event) => {
                            if (event.key == "Enter") {
                                validateThemeName(theme.id);
                                editingTheme = null;
                            }
                        }}
                        value={theme.name}
                    />
                    <div class="theme-author">{theme.author}</div>
                </div>
            </div>
            <div class="theme-entry-buttons">
                <Button
                    compact
                    nobg
                    tooltip={`Download ${theme.name}.theme.css`}
                    onClick={() => {
                        downloadTheme(theme);
                    }}
                >
                    <ZondiconsDownload height="14px" width="14px" />
                </Button>
                <Button
                    compact
                    nobg
                    tooltip={`Edit ${theme.name}`}
                    onClick={() => {
                        $editingThemeId = theme.id;
                    }}
                >
                    <ZondiconsEditPencil height="14px" width="14px" />
                </Button>
                <Button
                    compact
                    nobg
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

    <div class="theme-actions">
        <Button accent onClick={() => fileInput.click()}>
            <IcBaselineFileOpen />
            Import Theme
        </Button>
        <Button onClick={createTheme}>
            <IcRoundPlus style="transform:scale(1.25)" />
            Create New Theme
        </Button>

        {#if invalidFile}
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="theme-import-error">Invalid Theme File</label>
        {/if}
    </div>

    <input
        type="file"
        bind:this={fileInput}
        bind:files
        on:change={submitImport}
        accept="text/css,text/plain"
        style="display: none"
    />
</div>
<svelte:window
    on:click={(event) => {
        if (editingTheme == null) return;
        if (
            event.target instanceof HTMLElement &&
            !event.target.className.includes("editable")
        ) {
            if (document.getElementsByClassName("editable").length != 0) {
                let id = parseInt(
                    document.getElementsByClassName("editable")[0].id,
                );
                validateThemeName(id);
            }
            editingTheme = null;
        }
    }}
/>

<style>
    .theme-left-items {
        display: inline-flex;
    }

    .theme-arrows {
        display: flex;
        justify-content: center;
        flex-direction: column;
        margin-right: 5px;
    }

    .theme-title {
        border: none;
        display: inline;
        font-family: inherit;
        font-size: inherit;

        padding: 0;
        margin: 0;

        text-wrap: nowrap;
        width: auto;
        background: transparent;
        box-sizing: border-box;

        outline: 0px solid transparent;

        border-radius: 3px;

        transition:
            padding-left 0.1s ease-in-out,
            outline 0.1s ease-in-out;

        cursor: pointer;
    }

    .theme-credit {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .theme-author {
        color: var(--gray);
        font-size: 13px;
    }

    .theme-title:read-only {
        user-select: none;
    }

    .theme-title:read-only:hover {
        outline: 1px solid var(--gray);
    }

    .theme-title:read-write {
        background-color: var(--bg-0);
        outline: 1px solid var(--accent-color);
        cursor: text;
    }

    h3 {
        margin: 0px;
        padding-top: 20px;
    }

    .theme-entry {
        display: flex;
        justify-content: space-between;

        width: 500px;
        background-color: var(--bg-1);
        padding: 8px 16px;
        border-radius: 6px;
        padding-left: 10px;
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

    .theme-actions {
        display: flex;
        gap: 10px;
        margin-block: 10px;
        align-items: center;
    }

    .theme-import-error {
        color: var(--red);
    }
</style>
