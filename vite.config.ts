import { ConfigEnv, defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import Icons from "unplugin-icons/vite";

import { execSync } from "child_process"; 

// https://vitejs.dev/config/
export default defineConfig((env: ConfigEnv) => {
    const commitHash = execSync('git rev-parse HEAD').toString().trimEnd();

    return {
        plugins: [
            svelte(),
            Icons({
                compiler: "svelte",
            }),
        ],
        define: {
            ZLING_VERSION: JSON.stringify(commitHash.substr(0, 7)),
        }
    };
});
