<script lang="ts">
    import { Router, Link, Route } from "svelte-routing";
    import MainView from "./views/MainView.svelte";
    import LoginView from "./views/LoginView.svelte";
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
