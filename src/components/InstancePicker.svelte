<script lang="ts">
    import ZondiconsNetwork from "~icons/zondicons/network";
    import Dropdown from "./base/Dropdown.svelte";
    import { fly, slide } from "svelte/transition";
    import Button from "./base/Button.svelte";
    import MaterialSymbolsAdd from "~icons/material-symbols/add";
    import { currentInstance, instances } from "../lib/auth";

    export let open: boolean = true;

    function formatUrl(url: URL) {
        if (url.pathname.endsWith("/"))
            return url.host + url.pathname.slice(0, -1);
        return url.host + url.pathname;
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
        <Dropdown bind:open />
    </div>
</div>
{#if open}
    <div class="options" transition:slide={{ duration: 200 }}>
        {#each $instances as instance}
            <Button compact outline onClick={() => {
                $currentInstance = instance
            }}>
                <div class="instance option">
                    <ZondiconsNetwork width="20px" height="20px" />
                    <div>
                        <div class="name">{instance.name}</div>
                        <div class="url">{formatUrl(instance.url)}</div>
                    </div>
                </div>
            </Button>
        {/each}
        <Button outline>
            <div class="add-instance">
                <MaterialSymbolsAdd
                    font-size="18px"
                />Add Instance
            </div>
        </Button>
    </div>
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
    }

    .url {
        color: var(--green);
        font-size: 14px;
        font-family: monospace;
        font-weight: normal;
        line-height: 16px;
    }

    .options {
        display: flex;
        justify-content: center;
        gap: 8px;
        flex-direction: column;
        margin-top: 10px;
        margin-inline: 60px;
    }

    .option {
        color: var(--text-color);
        text-align: left;
        font-size: 14px;
        padding: 8px 20px;
    }

    .add-instance {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        margin-left: -10px;
    }
</style>
