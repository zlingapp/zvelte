<script lang="ts">
    import { Router, Link, Route } from "svelte-routing";
    import MainView from "./views/MainView.svelte";
    import LoginView from "./views/LoginView.svelte";
    import {currentTheme} from "./lib/stores"
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
<svelte:element this="style">{$currentTheme}</svelte:element>