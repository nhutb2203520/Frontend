<template>
  <div class="login-page mt-3">
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
            <input
              type="text"
              id="username"
              v-model="loginData.USERNAME"
              required
              placeholder="Nhập số điện thoại hoặc email"
            />
          </div>

          <div>
            <label for="password">Mật Khẩu:</label>
            <input
              type="password"
              id="password"
              v-model="loginData.PASSWORD"
              required
              placeholder="Nhập mật khẩu"
            />
          </div>

          <button type="submit">Đăng Nhập</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/utils/axiosAdmin"; // Sử dụng axiosAdmin đã cấu hình sessionStorage
import { useRouter } from "vue-router";

export default {
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
  setup() {
    const router = useRouter();
    return { router };
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

      try {
        const response = await axios.post("/staffs/login", {
          identifier: username,
          Password: this.loginData.PASSWORD,
        });

        const { token, nhanvien, message } = response.data;

        if (token) {
          sessionStorage.setItem("tokenuser", JSON.stringify(token));
          sessionStorage.setItem("role", JSON.stringify("admin"));
          sessionStorage.setItem("adminInfo", JSON.stringify(nhanvien));

          this.message = message || "Đăng nhập thành công!";
          this.success = true;

          setTimeout(() => {
            this.$router.push("/homeadmin").then(() => window.location.reload());
          }, 1000);
        } else {
          this.message = message || "Đăng nhập thất bại.";
          this.success = false;
        }
      } catch (error) {
        this.message = error.response?.data?.message || "Lỗi không xác định.";
        this.success = false;
      }
    },
  },
};
</script>

<style scoped>
@import "@/assets/sign.css";

.login-form {
  background-color: rgba(30, 30, 30, 0.9);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 480px;
  margin: 0 auto;
}

.login-form input {
  width: 100%;
  margin-bottom: 1rem;
  padding: 8px 12px;
}

.login-form button {
  width: 100%;
  padding: 10px;
}
</style>
