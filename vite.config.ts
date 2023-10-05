import { ConfigEnv, defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import Icons from "unplugin-icons/vite";

import { execSync } from "child_process"; 

// https://vitejs.dev/config/
export default defineConfig((env: ConfigEnv) => {
    let version;
    try {
        version = execSync('git rev-parse HEAD').toString().trimEnd().substr(0, 7);
    } catch (e) {
        console.error("Failed to get commit hash");
        version = "unknown";
    }

    return {
        plugins: [
            svelte(),
            Icons({
                compiler: "svelte",
            }),
        ],
        define: {
            ZLING_VERSION: JSON.stringify(version),
        }
    };
});
