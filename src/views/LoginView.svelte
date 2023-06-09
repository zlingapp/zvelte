<script lang="ts">
    import { link, navigate } from "svelte-routing";
    import IcOutlineClose from "~icons/ic/outline-close";
    import SvgSpinnersBarsRotateFade from "~icons/svg-spinners/bars-rotate-fade";
    import { apiTokens, localUser } from "../lib/stores";
    import { onMount, tick } from "svelte";
    import { tokenExpiryTimestamp, tryObtainLocalUser } from "../lib/auth";

    export let register: boolean = false;

    let error: string = null;
    let softError: string = null;
    let loading: boolean = false;

    $: valid = error == null && email && password && (!register || username);

    let email: string;
    let username: string; // registration only
    let password: string;

    // email regex: https://stackoverflow.com/a/46181/104380
    const EMAIL_REGEX =
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,16}$/;

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
        const res = await fetch("/api/auth/register", {
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
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

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
                case 401:
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
    <div class="login-pane">
        <img src="/zling.svg" alt="Zling Logo" height="100px" />
        <div class="title">
            {#if register}
                <h2>Register Account</h2>
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
                <input
                    bind:value={password}
                    on:change={validate}
                    on:input={() => (softError = null)}
                    name="password"
                    type="password"
                />
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
                            <SvgSpinnersBarsRotateFade />
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
    </div>
</main>

<style>
    main {
        display: flex;
        height: 100svh;
        width: 100vw;

        /* background-color: var(--bg-0); */
        background-image: url("/login-background.jpg");
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;

        color: var(--text-color);
    }

    main:after {
        content: "";
        display: block;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-image: radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 2px);
        background-size: 40px 40px;
        background-color: rgba(0, 0, 0, 0.3);

        z-index: 0;
    }

    .login-pane {
        margin: auto;
        margin-left: 25%;

        /* background-color: var(--bg-1); */
        border-radius: 12px;
        border: 2px solid rgba(255, 255, 255, 0.08);
        box-sizing: border-box;

        /* gradient top left to bottom right */
        /* background: linear-gradient(
            45deg,
            rgba(0, 0, 0, 0.5) 0%,
            rgba(0, 0, 0, 0.8) 100%
        ); */
        /* backdrop-filter: blur(200px); */
        background-color: var(--bg-2);

        box-shadow: rgba(0, 0, 0, 0.09) 0px 2px 1px,
            rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px,
            rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 25px;

        padding: 50px;

        z-index: 1;
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
            border: none;
            box-shadow: none;

            margin-left: auto;
        }

        .form {
            min-width: 310px;
        }
    }

    .version-info {
        position: absolute;
        top: 0;
        left: 0;
        box-sizing: border-box;
        margin: 20px 20px;
        color: rgba(0, 0, 0, 0.4);
        text-decoration: none;

        z-index: 1;
    }

    img {
        user-select: none;
        pointer-events: none;
    }
</style>
