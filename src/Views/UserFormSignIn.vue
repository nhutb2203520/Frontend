<template>
  <div class="container d-flex justify-content-center mt-5 mb-5">
    <div class="signform">
      <img src="@/assets/Logo.jpg" alt="Logo" class="logo_Login" />

      <!-- 🔔 Thông báo đăng nhập -->
      <p v-if="message" :class="['alert', success ? 'alert-success' : 'alert-danger']" role="alert">
        {{ message }}
      </p>

      <h2>Đăng Nhập</h2>
      <form @submit.prevent="submitLogin">
        <!-- Username -->
        <div class="mb-3">
          <label for="username" class="form-label">Số Điện Thoại/Email</label>
          <input type="text" id="username" v-model="loginData.USERNAME" required
            placeholder="Nhập số điện thoại hoặc email" class="form-control" />
        </div>

        <!-- Mật khẩu -->
        <div class="mb-3">
          <label for="password" class="form-label">Mật Khẩu</label>
          <input type="password" id="password" v-model="loginData.PASSWORD" required placeholder="Nhập mật khẩu"
            class="form-control" />
        </div>

        <!-- Nút đăng nhập -->
        <button type="submit" class="btn btn-primary w-100">Đăng Nhập</button>
      </form>
      <div>
        <p class="mt-3 text-center">
          Chưa có tài khoản? <router-link to="/signup">Đăng ký ngay</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import CryptoJS from "crypto-js";

export default {
  data() {
    return {
      loginData: {
        USERNAME: "",
        PASSWORD: ""
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

      // 🚫 Giả lập xác thực người dùng thay vì gọi API
      const validEmail = "nhut123@gmail.com";
      const validPasswordHash = CryptoJS.SHA256("nhut123").toString();

      if ((username === validEmail || username === "0123456789") && hashedPassword === validPasswordHash) {
        localStorage.setItem("tokenuser", JSON.stringify("fake-token-123"));
        localStorage.setItem("role", JSON.stringify("user"));

        this.message = "Đăng nhập thành công!";
        this.success = true;

        // Đợi để hiển thị thông báo
        setTimeout(() => {
          this.$router.push("/home").then(() => window.location.reload());
        }, 1000);
      } else {
        this.message = "Tài khoản hoặc mật khẩu không chính xác!";
        this.success = false;
      }
    }
  },

};
</script>
<style scoped>
@import "@/assets/sign.css";

.signform {
  background-color: rgba(30, 30, 30, 0.9);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);

  max-width: 400px;
  /* 👈 Giới hạn chiều rộng form */
  width: 100%;
}
</style>
