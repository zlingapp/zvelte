<script lang="ts">
    import { authFetch, urlRelativeToApiBase } from "../../lib/auth";
    import { localUser } from "../../lib/stores";
    import IconUpload from "../base/IconUpload.svelte";

    async function setAvatar({ url }: { url: string }) {
        $localUser.avatar = url;
        
        const resp = await authFetch("/settings/avatar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                avatar: url,
            }),
        });

        if (!resp.ok) {
            alert("Failed to set avatar");
            return;
        }
    }
</script>

<section>
    <h2>My Account</h2>
    <IconUpload onChange={setAvatar} defaultImage={urlRelativeToApiBase($localUser.avatar).toString()} />
</section>

<style></style>