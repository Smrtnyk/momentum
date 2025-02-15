import { createApp } from "vue";

import App from "./App.vue";
import { firebaseApp } from "./firebase";
import "./css/tailwind.css";

console.log(firebaseApp);

createApp(App).mount("#app");
