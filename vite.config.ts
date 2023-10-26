import { ConfigEnv, defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import Icons from "unplugin-icons/vite";
import mkcert from "vite-plugin-mkcert";

import { execSync } from "child_process";

function zvelteCssHash({ name, filename, css, hash }): string {
    // eg. z-ServerList, z-Tooltip, z-Button
    return `z-${name}`;
}

// https://vitejs.dev/config/
export default defineConfig((env: ConfigEnv) => {
    let version;
    try {
        version = execSync("git rev-parse HEAD")
            .toString()
            .trimEnd()
            .substr(0, 7);
    } catch (e) {
        console.error("Failed to get commit hash");
        version = "unknown";
    }

    return {
        plugins: [
            svelte({ compilerOptions: { cssHash: zvelteCssHash } }),
            Icons({
                compiler: "svelte",
            }),
            mkcert(),
        ],
        define: {
            ZLING_VERSION: JSON.stringify(version),
        },
        server: {
            port: 2000,
            https: true,
            open: true,
        },
        preview: {
            port: 2000,
        }
    };
});
