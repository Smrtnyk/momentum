import { PiniaColada } from "@pinia/colada";
import { createPinia } from "pinia";
import { createApp, h } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { createVuetify } from "vuetify";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import { VCalendar } from "vuetify/labs/VCalendar";
import "virtual:pwa-register";
import { VDateInput } from "vuetify/labs/VDateInput";
import { VTimePicker } from "vuetify/labs/VTimePicker";

import App from "./App.vue";
import ErrorBoundary from "./components/ErrorBoundary.vue";
import { currentLocale } from "./helpers/date-utils";
import router from "./router";

const pinia = createPinia();

const vuetify = createVuetify({
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
const vueApp = createApp({
    render: () =>
        h(ErrorBoundary, null, {
            default: () => h(App),
        }),
});
vueApp.component("ErrorBoundary", ErrorBoundary);
vueApp
    .use(router)
    .use(pinia)
    .use(PiniaColada, {
        queryOptions: {
            staleTime: Number.POSITIVE_INFINITY,
        },
    })
    .use(vuetify)
    .use(VueApexCharts);
vueApp.mount("#app");
