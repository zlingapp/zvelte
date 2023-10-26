<script lang="ts">
    import { Router, Link, Route } from "svelte-routing";
    import MainView from "./views/MainView.svelte";
    import LoginView from "./views/LoginView.svelte";
    import { themes } from "./lib/stores";
    import ThemeEditor from "./components/modals/ThemeEditor.svelte";
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