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
                    background: "#1F1D2B",
                    error: "#CF6679",
                    info: "#64B5F6",
                    onBackground: "#EAEAEC",
                    onPrimary: "#000000",
                    onSecondary: "#000000",
                    onSurface: "#EAEAEC",
                    primary: "#BB86FC",
                    secondary: "#FFAB40",
                    success: "#81C784",
                    surface: "#252836",
                    warning: "#FFD54F",
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
