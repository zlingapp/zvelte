import { navigate } from "svelte-routing";
import { get } from "svelte/store";
import { localUser } from "./stores";
import { disconnectFromVoice } from "./voice";

export interface LocalUser {
    id: string;
    username: string;
    avatar: string;
    session_token: string;
}

// we might have a LocalUser either already in a store,
// or a session cookie that can be used to get one from the server
export async function tryObtainLocalUser() {
    if (get(localUser) == null) {
        try {
            let res = await fetch("/api/auth/whoami");

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
        navigate("/login");
    }
}

export async function logOut() {
    disconnectFromVoice();
    await fetch("/api/auth/logout");
    localUser.set(null);
    navigate("/login");
}
