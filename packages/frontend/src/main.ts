import { createApp } from "vue";

import App from "./App.vue";
import { firebaseApp } from "./firebase";

console.log(firebaseApp);

createApp(App).mount("#app");
