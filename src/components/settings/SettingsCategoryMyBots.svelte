<script lang="ts">
    import Button from "src/components/base/Button.svelte";
    import ButtonWithTick from "src/components/base/ButtonWithTick.svelte";
    import IconUpload from "src/components/base/IconUpload.svelte";
    import Modal from "src/components/base/Modal.svelte";
    import Tooltip from "src/components/base/Tooltip.svelte";
    import Avatar from "src/components/users/Avatar.svelte";
    import { USERNAME_REGEX, authFetch } from "src/lib/auth";
    import type { PublicUserInfo } from "src/lib/channel";
    import type { UploadedFile } from "src/lib/upload";
    import { onMount } from "svelte";
    import IcRoundRefresh from "~icons/ic/round-refresh";
    import MaterialSymbolsContentCopyOutlineRounded from "~icons/material-symbols/content-copy-outline-rounded";
    import DeleteIcon from "~icons/material-symbols/delete-forever-outline";
    import SvgSpinnersRingResize from "~icons/svg-spinners/ring-resize";

    let bots: { refreshToken: string, user: PublicUserInfo }[] = [];

    async function fetchBots() {
        const resp = await authFetch("/bots");
        bots = await resp.json();
    }

    async function deleteBot(id: string) {
        const resp = await authFetch(`/bots/${id}`, {
            method: "DELETE",
        });

        if (!resp.ok) {
            alert("Failed to delete bot");
            return;
        }

        bots = bots.filter((bot) => bot.user.id !== id);
    }

    async function resetToken(id: string) {
        const resp = await authFetch(`/bots/${id}/tokenreset`, {
            method: "POST",
        });

        if (!resp.ok) {
            alert("Failed to reset bot token");
            return;
        }

        const { refreshToken } = await resp.json();

        // set the new token
        bots = bots.map((bot) => {
            if (bot.user.id === id) {
                bot.refreshToken = refreshToken;
            }
            return bot;
        });
    }

    onMount(async () => {
        await fetchBots();
    });

    let isCreateModalVisible = false;
    let createBotIcon: UploadedFile | null = null;
    let createBotName = `Bender`;
    let createLoading = false;

    async function createBot() {
        createLoading = true;

        const req = authFetch("/bots", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                avatar: createBotIcon!.url,
                username: createBotName,
            }),
        });

        // make it so the loading spinner doesn't flash by waiting a minimum
        // amount of time
        const placeboWait = new Promise((resolve) => {
            setTimeout(resolve, 500);
        });

        let [res] = await Promise.all([req, placeboWait]);

        isCreateModalVisible = false;
        createLoading = false;

        if (!res.ok) {
            alert(
                `Failed to create bot: ${res.status} ${
                    res.statusText
                }: ${await res.text()}`
            );
            return;
        }

        const bot = await res.json();
        bots.push(bot);

        await fetchBots();
    }
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<Modal bind:show={isCreateModalVisible}>
    <svelte:fragment slot="title">Create A Bot</svelte:fragment>

    <svelte:fragment slot="content">
        {#if createLoading}
            <div class="create-loading">
                <span>Creating your bot...</span>
                <SvgSpinnersRingResize
                    color="var(--accent-color)"
                    font-size="16px"
                />
            </div>
        {:else}
            <p style="width: 300px; margin-bottom: 16px;">
                To create a bot, you need to give it a name and an icon. This is
                how other people will see your bot.
            </p>
            <label>Bot Username</label>
            <input type="text" bind:value={createBotName} /><br />
            <label>Bot Icon</label>
            <IconUpload bind:uploadedFile={createBotIcon} />
        {/if}
    </svelte:fragment>

    <svelte:fragment slot="actions">
        <Button
            disabled={createBotIcon == null ||
                !USERNAME_REGEX.test(createBotName) ||
                createLoading}
            green
            grow
            onClick={createBot}>Create</Button
        >
        <Button
            disabled={createLoading}
            grow
            onClick={() => (isCreateModalVisible = false)}>Nevermind</Button
        >
    </svelte:fragment>
</Modal>

<section>
    <h2>Applications</h2>

    <p class="bots-info">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label>What is this?</label><br />
        Bots are third-party applications that can interact with Zling from the outside.You
        need to write code to make a bot do something, and keep your program running
        while you want your bot to be online. You can manage your bots on this page.
    </p>

    <p class="bots-info token-warning">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label style="color: white;">Security Warning</label><br />
        <strong>Keep your tokens safe!</strong> Treat them like passwords and
        don't share them with anyone. Your bot token is like a key to your bot,
        and anyone who has it has
        <strong>full access to your bot user</strong>.
    </p>

    <h3>Bots</h3>

    <Button accent onClick={() => (isCreateModalVisible = true)}>New Bot</Button
    >
    <div class="bots">
        {#each bots as bot (bot.user.id)}
            <div class="bot">
                <Avatar url={bot.user.avatar} status="offline" />
                <div>
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>name</label>
                    <div class="bot-name">{bot.user.username}</div>
                </div>
                <div>
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>ID</label>
                    <div class="bot-id">{bot.user.id}</div>
                </div>
                <div>
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label>Token</label>
                    <ButtonWithTick
                        onClick={() =>
                            navigator.clipboard.writeText(bot.refreshToken)}
                    >
                        <MaterialSymbolsContentCopyOutlineRounded
                            style="line-height: 0;"
                            font-size="16px"
                        />
                    </ButtonWithTick>
                </div>
                <span style="flex-grow: 1;" />
                <div class="actions">
                    <Tooltip text="Reset Token">
                        <span style="padding: 4px; transform: translateY(2px);">
                            <ButtonWithTick
                                onClick={() => resetToken(bot.user.id)}
                            >
                                <IcRoundRefresh
                                    style="line-height: 0;"
                                    font-size="18px"
                                />
                            </ButtonWithTick>
                        </span>
                    </Tooltip>
                    <Tooltip text="Delete">
                        <Button
                            danger
                            compact
                            nobg
                            onClick={() => deleteBot(bot.user.id)}
                            ><DeleteIcon
                                font-size="18px"
                                style="transform: translateY(2px)"
                            />
                        </Button>
                    </Tooltip>
                </div>
            </div>
        {/each}
    </div>
</section>

<style>
    h3 {
        margin-bottom: 0.5rem;
    }

    .bots-info {
        padding: 16px;
        background-color: var(--bg-1);
        border-radius: 10px;
        margin-bottom: 16px;
    }

    .token-warning {
        background-color: var(--red);
    }

    .create-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 10px;
    }

    .bot {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 10px;
        background-color: var(--bg-1);
        padding: 16px 25px;
        border-radius: 8px;
    }

    .bot-id {
        font-family: monospace;
    }

    .bots {
        padding-top: 16px;
    }

    .actions {
        display: flex;
    }
</style>
