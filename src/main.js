import "./assets/main.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router"; // 🟢 Import router
const pinia = createPinia();

const app = createApp(App);
app.use(router);
app.use(pinia);
app.mount("#app");
AOS.init();
