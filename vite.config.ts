import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import Icons from 'unplugin-icons/vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        svelte(),
        Icons({
            compiler: "svelte",
        }),
    ],
    server: {
        https: false,
        proxy: {
            // "/api": {
            //     target: "http://127.0.0.1:8080/",
            //     changeOrigin: true,
            //     secure: false,
            //     rewrite: (path) => path.replace(/^\/api/, ""),
            // },
            // "/api/ws": {
            //     target: "ws://127.0.0.1:8080/ws",
            //     changeOrigin: true,
            //     secure: false,
            //     rewrite: (path) => path.replace(/^\/api\/ws/, ""),
            //     ws: true,
            // },
        },
    },
});
