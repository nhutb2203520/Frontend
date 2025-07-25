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
    /^\/(signin(\/[^/]+)?|signinuser|admin\/signin(\/[^/]+)?)$/.test(to.path) ||
    to.path === "/signup" ||
    to.path === "/borrowinghistory" ||
    to.path === "/forgot-password" ||
    /^\/reset-password\/[^/]+$/.test(to.path)
  ) {
    document.body.classList.add("login-page");
  } else {
    document.body.classList.remove("login-page");
  }
  next();
});
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(router);
app.use(pinia);
import { useAuthStore } from "@/Store/auth.store";
const authStore = useAuthStore();
if (authStore.accessToken && authStore.refreshToken) {
  authStore.startRefreshLoop();
}
app.mount("#app");
AOS.init();
