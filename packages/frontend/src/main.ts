import type { ComponentPublicInstance } from "vue";

import { createApp } from "vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { VCalendar } from "vuetify/labs/VCalendar";
import { VDateInput } from "vuetify/labs/VDateInput";
import { VNumberInput } from "vuetify/labs/VNumberInput";

import App from "./App.vue";
import { initializeFirebase } from "./firebase";
import router from "./router";

const { auth } = initializeFirebase();

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
                        background: "#121212",
                        error: "#FF5252",
                        info: "#2196F3",
                        primary: "#1976D2",
                        secondary: "#424242",
                        success: "#4CAF50",
                        surface: "#1E1E1E",
                        warning: "#FB8C00",
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
        app = createApp(App).use(router).use(vuetify).mount("#app");
    }
});
