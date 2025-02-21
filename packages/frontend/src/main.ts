import type { ComponentPublicInstance } from "vue";

import { createPinia } from "pinia";
import { createApp } from "vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import { VCalendar } from "vuetify/labs/VCalendar";
import { VDateInput } from "vuetify/labs/VDateInput";
import { VNumberInput } from "vuetify/labs/VNumberInput";

import App from "./App.vue";
import { initializeFirebase } from "./firebase";
import router from "./router";

const { auth } = initializeFirebase();

const pinia = createPinia();

function createVuetifyInstance(): ReturnType<typeof createVuetify> {
    return createVuetify({
        components: {
            ...components,
            VCalendar,
            VDateInput,
            VNumberInput,
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
    if (!app) {
        const vuetify = createVuetifyInstance();
        app = createApp(App).use(router).use(pinia).use(vuetify).mount("#app");
    }
});
