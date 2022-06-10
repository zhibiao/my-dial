import { createApp } from "vue";
import App from "./App.vue";
import drag from "./drag";

const app = createApp(App);
app.use(drag);
app.mount("#app");
