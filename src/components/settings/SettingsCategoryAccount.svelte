<script lang="ts">
    import IconUpload from "src/components/base/IconUpload.svelte";
    import { authFetch, urlRelativeToApiBase } from "src/lib/auth";
    import { localUser } from "src/lib/stores";

    async function setAvatar({ url }: { url: string }) {
        $localUser!.avatar = url;
        
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

    $: localUser_ = $localUser!; // because typescript is dumb
</script>

<section>
    <h2>My Account</h2>
    <IconUpload onChange={setAvatar} defaultImage={urlRelativeToApiBase(localUser_.avatar).toString()} />
</section>

<style></style>