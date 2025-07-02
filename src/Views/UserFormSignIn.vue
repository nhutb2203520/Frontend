<template>
  <div class="form-container">
    <div class="signform">
      <img src="@/assets/Logo.jpg" alt="Logo" class="logo_Login" />

      <!-- 🔔 Thông báo đăng nhập -->
      <p v-if="message" :class="['alert', success ? 'alert-success' : 'alert-danger']" role="alert">
        {{ message }}
      </p>

      <h2>Đăng Nhập</h2>
      <form @submit.prevent="submitLogin">
        <!-- Username -->
        <div>
          <label for="username">Số Điện Thoại/Email:</label>
          <input type="text" id="username" v-model="loginData.USERNAME" required
            placeholder="Nhập số điện thoại hoặc email" />
        </div>

        <!-- Mật khẩu -->
        <div>
          <label for="password">Mật Khẩu:</label>
          <input type="password" id="password" v-model="loginData.PASSWORD" required placeholder="Nhập mật khẩu" />
        </div>

        <!-- Nút đăng nhập -->
        <button type="submit">Đăng Nhập</button>
      </form>
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

<!--
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        loginData: {
          USERNAME: "", // Số điện thoại hoặc email
          PASSWORD: "", // Mật khẩu
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
  
        // Chuẩn bị dữ liệu gửi đi
        const payload = {
          PASSWORD: this.loginData.PASSWORD,
        };
  
        if (isPhone) {
          payload.DIENTHOAI = username;
        } else {
          payload.EMAIL = username;
        }
  
        try {
          const response = await axios.post(
            "http://localhost:3000/api/docgia/login",
            payload
          );
  
          if (response.status === 200) {
            localStorage.setItem("tokenuser", JSON.stringify(response.data.token));
            localStorage.setItem("role", JSON.stringify(response.data.role));
  
            this.$router.push("/home").then(() => window.location.reload());
            this.message = "Đăng nhập thành công!";
            this.success = true;
          }
        } catch (error) {
          this.message = "Đăng nhập thất bại, vui lòng kiểm tra lại!";
          this.success = false;
        }
      },
    },
  };
  </script>
  -->

<style scoped>
@import "@/assets/sign.css";
</style>
