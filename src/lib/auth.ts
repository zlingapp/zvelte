import { navigate } from "svelte-routing";
import { get } from "svelte/store";
import { apiTokens, localUser } from "./stores";
import { disconnectFromVoice } from "./voice";

var ensureHaveTokensFuture = null;

export interface LocalUser {
    id: string;
    name: string;
    avatar: string;
}

export interface Tokens {
    accessToken: string;
    accessExpires: number;
    refreshToken: string;
    refreshExpires: number;
}

export async function  ensureHaveValidTokens() {
    if (ensureHaveTokensFuture == null) {
        ensureHaveTokensFuture = _ensureHaveValidTokens();
    }
    const retval = await ensureHaveTokensFuture;
    ensureHaveTokensFuture = null;
    return retval;
}

async function _ensureHaveValidTokens() {
    let tokens = get(apiTokens);
    if (tokens != null) {
        // if the access token is about to expire, try to refresh it
        const hasAccessTokenExpired = tokens.accessExpires < (Date.now() / 1000);
        const hasRefreshTokenExpired = tokens.refreshExpires < (Date.now() / 1000);
        if (hasAccessTokenExpired) {
            if (hasRefreshTokenExpired) {
                // refresh token expired, nothing we can do but ask the user to log in again
                logOut();
                return;
            }

            // try to refresh the access token
            let res = await fetch("/api/auth/reissue", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    refreshToken: tokens.refreshToken,
                }),
            });

            if (!res.ok) {
                // reissue failed, ask the user to log in again
                logOut();
                return;
            }

            // reissue succeeded, update the tokens
            const newTokens = await res.json();
            apiTokens.set({
                accessToken: newTokens.accessToken,
                accessExpires: tokenExpiryTimestamp(newTokens.accessToken),
                refreshToken: newTokens.refreshToken,
                refreshExpires: tokenExpiryTimestamp(newTokens.refreshToken),
            });
            return get(apiTokens);
        }
    }
    return tokens;
}

export async function auth_fetch(
    input: RequestInfo | URL,
    init?: RequestInit
): Promise<Response> {
    let tokens = await ensureHaveValidTokens();
    if (tokens != null) {
        if (init == null) {
            init = {};
        }

        init.headers = {
            ...init.headers,
            Authorization: `Bearer ${tokens.accessToken}`,
        };
    }
    return fetch(input, init);
}

// we might have a LocalUser either already in a store,
// or a session cookie that can be used to get one from the server
export async function tryObtainLocalUser() {
    if (get(localUser) == null) {
        try {
            let res = await auth_fetch("/api/auth/whoami");

            if (res.status == 200) {
                localUser.set(await res.json());
            }
        } catch (e) {
            console.error(e);
        }

        if (get(localUser) == null) {
            return false;
        }
    }
    return true;
}

export async function ensureLoggedIn() {
    if (!(await tryObtainLocalUser())) {
        goToLogin();
        return false;
    }
    return true;
}

export async function logOut() {
    disconnectFromVoice();
    const tokens = get(apiTokens);
    if (tokens?.refreshExpires < Date.now() / 1000) {
        await auth_fetch("/api/auth/logout");
    }
    goToLogin();
}

// call this instead of navigate("/login") to avoid any stores surviving
function goToLogin() {
    apiTokens.set(null);
    location.href = "/login";
}

export function tokenExpiryTimestamp(token): number {
    const base64url = token.split(".")[1];
    
    const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base64);
    let timestamp = 0;

    for (let i = 0; i < binary.length; i++) {
        timestamp = (timestamp << 8) | binary.charCodeAt(i);
    }

    return timestamp;
}
