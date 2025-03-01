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
            workbox: {
                cleanupOutdatedCaches: true,
                // Cache static resources
                globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"],
                // Cache specific routes and assets
                runtimeCaching: [
                    {
                        handler: "CacheFirst",
                        options: {
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                            cacheName: "google-fonts-cache",
                            expiration: {
                                maxAgeSeconds: 60 * 60 * 24 * 365,
                                maxEntries: 10,
                            },
                        },
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                    },
                    {
                        handler: "CacheFirst",
                        options: {
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                            cacheName: "gstatic-fonts-cache",
                            expiration: {
                                maxAgeSeconds: 60 * 60 * 24 * 365,
                                maxEntries: 10,
                            },
                        },
                        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                    },
                ],
                // Skip waiting by default - automatically activate the new SW
                skipWaiting: true,
            },
        }),
    ],
});
