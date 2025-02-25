import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import vuetify from "vite-plugin-vuetify";

export default defineConfig({
    plugins: [
        vue(),
        vuetify({
            autoImport: true,
        }),
        VitePWA({
            includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
            manifest: {
                description: "Momentum Fitness App",
                icons: [
                    {
                        sizes: "192x192",
                        src: "icon-192x192.png",
                        type: "image/png",
                    },
                    {
                        sizes: "512x512",
                        src: "icon-512x512.png",
                        type: "image/png",
                    },
                ],
                name: "Momentum",
                short_name: "Momentum",
                theme_color: "#27293D",
            },
            registerType: "autoUpdate",
        }),
    ],
});
