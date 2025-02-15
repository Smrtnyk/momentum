import type { ComponentPublicInstance } from "vue";

import { createApp } from "vue";

import App from "./App.vue";
import { auth } from "./firebase";
import "./css/tailwind.css";
import router from "./router";

let app: ComponentPublicInstance | null = null;

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App).use(router).mount("#app");
  }
});
