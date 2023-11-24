<script lang="ts">
    import { navigate } from "svelte-routing";
    import { authFetch, ensureLoggedIn } from "../lib/auth";
    import { currentGuild } from "../lib/stores";
    import { onMount } from "svelte";
    export let code;

    onMount(async () => {
        if (await ensureLoggedIn()) {
            let resp = await authFetch(`/invites/${code}`, {
                method: "POST",
            });
            if (resp.ok) {
                let json = await resp.json();
                $currentGuild = json
            }
        }
        navigate("/");
    });
</script>
