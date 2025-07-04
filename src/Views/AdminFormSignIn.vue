<template>
  <div class="login-page mt-3">
    <div class="nav-wrapper">
      <NavBarAD />
    </div>

    <div class="form-container">
      <div class="login-form">
        <img src="@/assets/Logo.jpg" alt="Logo" class="logo_Login" />

        <p v-if="message" :class="['alert', success ? 'alert-success' : 'alert-danger']" role="alert">
          {{ message }}
        </p>

        <h2>Đăng Nhập Tài Khoản Thủ Thư</h2>

        <form @submit.prevent="submitLogin">
          <div>
            <label for="username">Số Điện Thoại/Email:</label>
            <input type="text" id="username" v-model="loginData.USERNAME" required
              placeholder="Nhập số điện thoại hoặc email" />
          </div>

          <div>
            <label for="password">Mật Khẩu:</label>
            <input type="password" id="password" v-model="loginData.PASSWORD" required placeholder="Nhập mật khẩu" />
          </div>

          <button type="submit">Đăng Nhập</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import CryptoJS from "crypto-js";
import NavBarAD from "@/components/Admin/NavBarAD.vue";

export default {
  components: {
    NavBarAD,
  },
  data() {
    return {
      loginData: {
        USERNAME: "",
        PASSWORD: "",
      },
      message: "",
      success: false,
    };
  },
  methods: {
    async submitLogin() {
      const username = this.loginData.USERNAME.trim();
      const isPhone = /^[0-9]{10}$/.test(username);
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(username);

      if (!isPhone && !isEmail) {
        this.message = "Vui lòng nhập số điện thoại (10 số) hoặc email hợp lệ!";
        this.success = false;
        return;
      }

      const hashedPassword = CryptoJS.SHA256(this.loginData.PASSWORD).toString();

      const validEmail = "nhut123@gmail.com";
      const validPasswordHash = CryptoJS.SHA256("nhut123").toString();

      if ((username === validEmail || username === "0123456789") && hashedPassword === validPasswordHash) {
        localStorage.setItem("tokenuser", JSON.stringify("fake-token-123"));
        localStorage.setItem("role", JSON.stringify("user"));

        this.message = "Đăng nhập thành công!";
        this.success = true;

        setTimeout(() => {
          this.$router.push("/home").then(() => window.location.reload());
        }, 1000);
      } else {
        this.message = "Tài khoản hoặc mật khẩu không chính xác!";
        this.success = false;
      }
    },
  },
};
</script>

<style scoped>
@import "@/assets/sign.css";
</style>
