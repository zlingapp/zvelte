<script lang="ts">
    import Button from "src/components/base/Button.svelte";
    import DropdownArrow from "src/components/base/DropdownArrow.svelte";
    import Modal from "src/components/base/Modal.svelte";
    import { currentInstance, instances, type Instance } from "src/lib/auth";
    import { slide } from "svelte/transition";
    import MaterialSymbolsAdd from "~icons/material-symbols/add";
    import ZondiconsNetwork from "~icons/zondicons/network";
    import ZondiconsTrash from "~icons/zondicons/trash";

    export let open: boolean = true;
    let isAddModalOpen = false;
    let urlError = false;
    let dupError = false;
    let addInstanceName: string | null = null;
    let addInstanceUrl: string | null = null;

    function clear() {
        isAddModalOpen = false;
        urlError = false;
        dupError = false;
        addInstanceName = null;
        addInstanceUrl = null;
    }

    function addInstance() {
        dupError = false;
        urlError = false;
        if (!addInstanceUrl) {
            urlError = true;
            return;
        }

        let url: URL | null = null;

        try {
            url = new URL(addInstanceUrl);
        } catch {
            urlError = true;
            return;
        }
        if (
            $instances.filter(
                (instance) => instance.url.toString() == url?.toString(),
            ).length
        ) {
            dupError = true;
            return;
        }

        instances.update((arr: Instance[]) =>
            arr.concat([
                {
                    name: addInstanceName ?? "New Instance",
                    url: new URL(addInstanceUrl!),
                },
            ]),
        );

        isAddModalOpen = false;
        addInstanceName = null;
        addInstanceUrl = null;
    }

    function formatUrl(url: URL) {
        if (url.pathname.endsWith("/"))
            return url.host + url.pathname.slice(0, -1);
        return url.host + url.pathname;
    }

    function removeInstance(instance: Instance): void {
        $currentInstance = $instances[0];
        instances.update((arr: Instance[]) =>
            arr.filter((i) => i.url != instance.url),
        );
    }
</script>

<div class="instance-picker" class:open>
    <span style="color: var(--text-color)">Signing in to</span>
    <div class="instance">
        <ZondiconsNetwork
            color="var(--green)"
            font-size="18px"
            width="20px"
            height="20px"
        />
        <div>
            <div class="name">{$currentInstance.name}</div>
            <div class="url">{formatUrl($currentInstance.url)}</div>
        </div>
        <DropdownArrow bind:open />
    </div>
</div>
{#if open}
    <div class="options" transition:slide={{ duration: 200 }}>
        {#each $instances as instance}
            <Button
                compact
                outline
                onClick={() => {
                    open = false;
                    $currentInstance = instance;
                }}
            >
                <div class="instance option">
                    <ZondiconsNetwork
                        style="min-width: 20px; min-height: 20px"
                    />
                    <div>
                        <div class="name">{instance.name}</div>
                        <div class="url">{formatUrl(instance.url)}</div>
                    </div>
                    {#if instance.url.toString() != "https://api.zlingapp.com/"}
                        <div style="flex-grow: 1;" />
                        <div class="remove-button">
                            <Button
                                compact
                                onClick={() => removeInstance(instance)}
                            >
                                <ZondiconsTrash width="14px" height="14px" />
                            </Button>
                        </div>
                    {/if}
                </div>
            </Button>
        {/each}
        <Button outline onClick={() => (isAddModalOpen = true)}>
            <div class="add-instance">
                <MaterialSymbolsAdd font-size="18px" />Add Instance
            </div>
        </Button>
    </div>
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <Modal bind:show={isAddModalOpen} onClose={clear}>
        <svelte:fragment slot="title">Add an Instance</svelte:fragment>

        <svelte:fragment slot="content">
            <label>Instance Name</label>
            <input
                type="text"
                bind:value={addInstanceName}
                placeholder="New Instance"
            />
            <label>Base URL</label>
            <input
                type="text"
                bind:value={addInstanceUrl}
                placeholder="https://example.com/"
            />
            {#if urlError}
                <label style="color: var(--red)">Invalid URL</label>
            {/if}
            {#if dupError}
                <label style="color: var(--red)"
                    >That instance already exists</label
                >
            {/if}
        </svelte:fragment>

        <svelte:fragment slot="actions">
            <Button green grow onClick={addInstance}>Add Instance</Button>
            <Button grow onClick={clear}>Nevermind</Button>
        </svelte:fragment>
    </Modal>
{/if}

<style>
    .instance {
        display: flex;
        gap: 10px;
        align-items: center;
    }

    .instance-picker {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding-inline: 35px;
    }

    .name {
        font-weight: 600;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        max-width: 200px;
    }

    .url {
        color: var(--green);
        font-size: 14px;
        font-family: monospace;
        font-weight: normal;
        line-height: 16px;


        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        max-width: 200px;
    }

    .options {
        display: flex;
        justify-content: center;
        gap: 8px;
        flex-direction: column;
        margin-top: 10px;
        margin-inline: 16px;
    }

    .option {
        color: var(--text-color);
        text-align: left;
        font-size: 14px;
        padding: 8px 10px;
        flex-grow: 1;
        width: 300px;
    }

    .add-instance {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        margin-left: -10px;
    }
</style>
