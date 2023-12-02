<script lang="ts">
    import InstancePicker from "src/components/InstancePicker.svelte";
    import {
        EMAIL_REGEX,
        USERNAME_REGEX,
        apiFetch,
        currentInstance,
        tokenExpiryTimestamp,
        tryObtainLocalUser,
    } from "src/lib/auth";
    import { apiTokens, localUser } from "src/lib/stores";
    import { onMount } from "svelte";
    import { link, navigate } from "svelte-routing";
    import IcOutlineClose from "~icons/ic/outline-close";
    import MaterialSymbolsVisibilityOffOutlineRounded from "~icons/material-symbols/visibility-off-outline-rounded";
    import MaterialSymbolsVisibilityOutlineRounded from "~icons/material-symbols/visibility-outline-rounded";
    import SvgSpinnersRingResize from "~icons/svg-spinners/ring-resize";

    export let register: boolean = false;
    export let instancePickerOpen: boolean = false;

    let error: string | null = null;
    let softError: string | null = null;
    let loading: boolean = false;
    let showPassword: boolean = false;

    $: valid = error == null && email && password && (!register || username);

    let email: string;
    let username: string; // registration only
    let password: string = "";

    onMount(async () => {
        if (await tryObtainLocalUser()) {
            navigate("/");
        }
    });

    function validate() {
        error = null;

        if (!EMAIL_REGEX.test(email)) {
            error = "Please enter a valid email.";
            return false;
        }

        if (register) {
            if (!USERNAME_REGEX.test(username)) {
                error =
                    "Username must be 3-16 letters long and contain only letters, numbers, and underscores.";
                return false;
            }

            if (password?.length < 8) {
                error = "Password must be at least 8 characters.";
                return false;
            }
        }

        return true;
    }

    async function onSubmit(event: SubmitEvent) {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        loading = true;
        if (register) {
            await registerAccount();
        } else {
            await login();
        }
        loading = false;
    }

    async function registerAccount() {
        let res: Response;

        try {
            res = await apiFetch("/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    username,
                    password,
                }),
            });
        } catch (e) {
            softError = `Failed to connect to ${$currentInstance.url.host}`;
            return;
        }

        if (res.status == 200) {
            navigate("/login");
            return;
        } else {
            switch (res.status) {
                case 400:
                    softError = "Invalid registration details.";
                    break;
                case 409:
                    softError = "That username or email is already in use.";
                    break;
                default:
                    softError = `Something went wrong: ${res.status} ${res.statusText}`;
                    break;
            }
        }
    }

    async function login() {
        const req = apiFetch("/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        // make it so the loading spinner doesn't flash by waiting a minimum
        // amount of time
        const placeboWait = new Promise((resolve) => {
            setTimeout(resolve, 500);
        });

        let res: Response;

        try {
            [res] = await Promise.all([req, placeboWait]);
        } catch (e) {
            softError = `Failed to connect to ${$currentInstance.url.host}`;
            return;
        }

        if (res.status == 200) {
            let data = await res.json();

            $apiTokens = {
                accessToken: data.accessToken,
                accessExpires: tokenExpiryTimestamp(data.accessToken),
                refreshToken: data.refreshToken,
                refreshExpires: tokenExpiryTimestamp(data.refreshToken),
            };

            $localUser = data.user;
            navigate("/");
            return;
        } else {
            switch (res.status) {
                case 403:
                    softError = "Invalid username or password.";
                    break;
                default:
                    softError = `Something went wrong: ${res.status} ${res.statusText}`;
                    break;
            }
        }
    }
</script>

<main>
    <!-- svelte-ignore missing-declaration -->
    <a class="version-info" href="https://github.com/zlingapp/zvelte">
        <strong>zvelte</strong>
        {ZLING_VERSION}
    </a>
    <div class="pane login-pane">
        <img src="/zling-mono.svg" alt="Zling Logo" height="100px" />
        <div class="title">
            {#if register}
                <h2>New Account</h2>
                <p>Fill out your information below.</p>
            {:else}
                <h2>Welcome back!</h2>
                <p>Log in to your account to continue.</p>
            {/if}
        </div>
        <form on:submit={onSubmit}>
            <div class="form">
                <label for="email">Email</label>
                <input
                    bind:value={email}
                    on:change={validate}
                    on:input={() => (softError = null)}
                    name="email"
                    type="text"
                />

                {#if register}
                    <label for="username">Username</label>
                    <input
                        bind:value={username}
                        on:change={validate}
                        on:input={() => (softError = null)}
                        name="username"
                        type="text"
                    />
                {/if}

                <label for="password">Password</label>
                <div style="position: relative;">
                    <input
                        value={password}
                        on:change={(e) => {
                            if (e.target instanceof HTMLInputElement) {
                                password = e.target["value"];
                                validate();
                            }
                        }}
                        on:input={(e) => (softError = null)}
                        name="password"
                        type={showPassword ? "text" : "password"}
                        class:shown={showPassword}
                    />
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div
                        class="show-pw-btn"
                        on:click={() => (showPassword = !showPassword)}
                    >
                        {#if showPassword}
                            <MaterialSymbolsVisibilityOutlineRounded
                                color="var(--text-color)"
                                font-size="18px"
                                height="100%"
                            />
                        {:else}
                            <MaterialSymbolsVisibilityOffOutlineRounded
                                font-size="18px"
                                height="100%"
                            />
                        {/if}
                    </div>
                </div>
                <span style="flex-grow: 1;" />

                {#if error || softError}
                    <div class="error">
                        <div style="line-height: 0;">
                            <IcOutlineClose />
                        </div>
                        <p>{error || softError}</p>
                    </div>
                {/if}

                <div class="actions">
                    <button type="submit" disabled={!valid || loading}>
                        {#if loading}
                            <SvgSpinnersRingResize />
                        {:else if register}
                            Register
                        {:else}
                            Log In
                        {/if}
                    </button>
                </div>
                <p class="no-acct">
                    {#if register}
                        Already have an account? <a href="/login" use:link
                            >Log in</a
                        >
                    {:else}
                        Don't have an account? <a href="/register" use:link
                            >Register</a
                        >
                    {/if}
                </p>
            </div>
        </form>
        <div class="pane instances-pane" class:focus={instancePickerOpen}>
            <InstancePicker bind:open={instancePickerOpen} />
        </div>
        {#if instancePickerOpen}
            <div
                class="instances-pane-backdrop"
                on:click|self={() => (instancePickerOpen = false)}
            />
        {/if}
    </div>
</main>

<style>
    main {
        display: flex;
        height: 100svh;
        width: 100vw;
        flex-direction: column;
        justify-content: center;
        gap: 15px;

        background-color: var(--bg-0);
        background-image: url("/login-background.jpg");
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;

        color: var(--text-color);
        overflow: hidden;
    }

    .pane {
        position: relative;
        margin-inline: auto;
        /* margin-left:289%; */

        /* background-color: var(--bg-1); */
        border-radius: 12px;
        border: 2px solid rgba(255, 255, 255, 0.08);
        box-sizing: border-box;

        /* gradient top left to bottom right */
        /* background: linear-gradient(
            45deg,
            rgba(0, 0, 0, 0.5) 0%,
            rgba(0, 0, 0, 0.8) 100%
        );
        backdrop-filter: blur(200px); */
        background-color: var(--bg-1);

        box-shadow:
            rgba(0, 0, 0, 0.09) 0px 2px 1px,
            rgba(0, 0, 0, 0.09) 0px 4px 2px,
            rgba(0, 0, 0, 0.09) 0px 8px 4px,
            rgba(0, 0, 0, 0.09) 0px 16px 8px,
            rgba(0, 0, 0, 0.09) 0px 32px 16px;

        padding: 20px;
        padding-inline: 0;

        z-index: 1;
    }

    .instances-pane {
        transition: top 0.3s ease-in-out, bottom 0.3s ease-in-out;

        position: absolute;
        top: calc(100% + 16px);
    }

    .instances-pane.focus {
        z-index: 1;
        top: 10%;
    }

    .instances-pane-backdrop {
        content: "";
        position: fixed;
        top: 0;
        left: 0;

        width: 100vw;
        height: 100vh;

        background-color: rgba(0, 0, 0, 0.5);
    }

    .login-pane {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 25px;
        padding: 50px;
    }

    .title {
        color: var(--text-color);
        text-align: center;
    }

    .title > h2 {
        line-height: 30px;
        margin: 10px;
    }

    .form {
        display: block;
        gap: 12px;
        min-width: 360px;
    }

    button {
        margin-top: 20px;
        background-color: var(--accent-color);
        cursor: pointer;
        border: none;
        padding: 12px 30px;
        border-radius: 6px;

        width: 100%;
        height: 40px;

        color: var(--text-color);
        font-weight: bold;
    }

    button:disabled {
        color: var(--disabled-text);
        background-color: var(--disabled);
        cursor: not-allowed;
    }

    .error {
        margin-top: 20px;
        color: var(--red);

        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;

        max-width: 380px;
        word-wrap: normal;
    }

    .no-acct {
        margin-top: 5px;
        font-size: 14px;
        color: var(--gray);
    }

    /* on mobile devices */
    @media (max-width: 768px) {
        .login-pane {
            padding: 50px;
            height: 100svh;
            width: 100vw;
            border-radius: 0;
        }

        .pane {
            border: none;
            box-shadow: none;
        }

        .form {
            min-width: 310px;
        }

        .instances-pane {
            top: unset;
            bottom: 25px;
            box-shadow: none;
        }

        .instances-pane.focus {
            top: unset;
            bottom: 25px;
        }
    }

    .version-info {
        position: absolute;
        top: 0;
        left: 0;
        box-sizing: border-box;
        margin: 20px 20px;
        color: rgba(255, 255, 255, 0.7);
        text-decoration: none;

        z-index: 1;
    }

    img {
        user-select: none;
        pointer-events: none;
    }

    .show-pw-btn {
        position: absolute;
        right: 16px;
        top: 0;
        bottom: 0;
        color: var(--disabled-text);
        transition:
            right 0.2s var(--sproing),
            transform 0.2s var(--sproing);
        cursor: pointer;
    }

    input {
        transition: transform 0.2s var(--sproing);
    }

    input:focus {
        transform: scale(1.02);
        border-color: var(--accent-color);
    }

    input:focus + .show-pw-btn {
        right: 12px;
    }

    .show-pw-btn:active {
        transform: scale(0.85);
    }

    .shown {
        border-style: dashed;
    }
</style>
