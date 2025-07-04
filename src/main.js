import "./assets/main.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import AOS from "aos";
import "aos/dist/aos.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";
import router from "./router"; // 🟢 Import router
const pinia = createPinia();

const app = createApp(App);
app.use(ElementPlus);
router.beforeEach((to, from, next) => {
  // Nếu là login hoặc register thì thêm class
  if (
    to.path === "/signinuser" ||
    to.path === "/signup" ||
    to.path === "/borrowinghistory"
  ) {
    document.body.classList.add("login-page");
  } else {
    document.body.classList.remove("login-page");
  }
  next();
});
app.use(router);
app.use(pinia);
app.mount("#app");
AOS.init();
