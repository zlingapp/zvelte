import "./app.css";
import App from "./App.svelte";

const target = document.getElementById("app");

const app = new App({
    target: target.parentElement,
    anchor: target,
});

target.remove();

export default app;
