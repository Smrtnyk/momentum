import type { ComponentPublicInstance } from "vue";

import { createPinia } from "pinia";
import { createApp, h } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import { VCalendar } from "vuetify/labs/VCalendar";
import { VDateInput } from "vuetify/labs/VDateInput";
import "virtual:pwa-register";
import { VTimePicker } from "vuetify/labs/VTimePicker";

import App from "./App.vue";
import ErrorBoundary from "./components/ErrorBoundary.vue";
import { auth } from "./firebase";
import { currentLocale } from "./helpers/date-utils";
import { logger } from "./logger/app-logger";
import router from "./router";

globalThis.addEventListener("error", function (event) {
    if (
        event.error &&
        (event.error.message?.includes("Failed to fetch dynamically imported module") ||
            event.error.message?.includes("Loading chunk") ||
            event.error.message?.includes("ChunkLoadError"))
    ) {
        logger.error("Chunk loading error detected:", event.error);

        if (!document.getElementById("update-notification")) {
            const notification = document.createElement("div");
            notification.id = "update-notification";
            notification.style.cssText =
                "position:fixed;top:0;left:0;right:0;background:#ff9800;color:#fff;text-align:center;padding:12px;z-index:9999;";
            notification.innerHTML =
                'Application update required. <button onclick="window.location.reload()" style="background:#fff;color:#ff9800;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;margin-left:10px;">Refresh Now</button>';
            document.body.appendChild(notification);
        }
    }
});

const pinia = createPinia();

function createVuetifyInstance(): ReturnType<typeof createVuetify> {
    return createVuetify({
        components: {
            ...components,
            VCalendar,
            VDateInput,
            VTimePicker,
        },
        date: {
            locale: {
                en: currentLocale,
            },
        },
        directives,
        icons: {
            aliases,
            defaultSet: "mdi",
            sets: {
                mdi,
            },
        },
        theme: {
            defaultTheme: "dark",
            themes: {
                dark: {
                    colors: {
                        background: "#1E1E2F",
                        error: "#F44336",
                        info: "#2196F3",
                        onBackground: "#E0E0E0",
                        onPrimary: "#FFFFFF",
                        onSecondary: "#FFFFFF",
                        onSurface: "#E0E0E0",
                        primary: "#00BCD4",
                        secondary: "#FF4081",
                        success: "#4CAF50",
                        surface: "#27293D",
                        warning: "#FFC107",
                    },
                    dark: true,
                },
            },
        },
    });
}

let app: ComponentPublicInstance | null = null;

auth.onAuthStateChanged(function () {
    if (app) {
        return;
    }

    const vuetify = createVuetifyInstance();
    const vueApp = createApp({
        render: () =>
            h(ErrorBoundary, null, {
                default: () => h(App),
            }),
    });
    vueApp.component("ErrorBoundary", ErrorBoundary);
    vueApp.use(router).use(pinia).use(vuetify).use(VueApexCharts);
    app = vueApp.mount("#app");
});
