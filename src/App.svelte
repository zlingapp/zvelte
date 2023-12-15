<script lang="ts">
    import ThemeEditor from "src/components/modals/ThemeEditor.svelte";
    import { themes } from "src/lib/stores";
    import LoginView from "src/views/LoginView.svelte";
    import MainView from "src/views/MainView.svelte";
    import { Route, Router } from "svelte-routing";
</script>

<Router>
    <Route path="/">
        <MainView />
    </Route>
    <Route path="/login">
        <LoginView />
    </Route>
    <Route path="/register">
        <LoginView register />
    </Route>
</Router>

<!-- prevents default context menu from opening -->
<svelte:window on:contextmenu={(e) => e.preventDefault()} />

<!-- Load themes from bottom to top-->
{#each $themes.toReversed().filter((x) => x.enabled) as theme}
    <svelte:element this="style">{theme.style}</svelte:element>
{/each}

<ThemeEditor />