<template>
  <div class="login-page">
    <div class="form-container">
      <div class="login-form">
        <img src="@/assets/Logo.jpg" alt="Logo" class="logo_Login" />

        <h2>Đăng Nhập</h2>
        <form @submit.prevent="submitLogin">
          <div class="form-group">
            <label for="username">Số Điện Thoại/Email:</label>
            <input
              type="text"
              id="username"
              v-model="loginData.USERNAME"
              required
              placeholder="Nhập số điện thoại hoặc email"
            />
          </div>

          <div class="form-group">
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

        <p
          v-if="message"
          :class="['alert', success ? 'alert-success' : 'alert-danger']"
        >
          {{ message }}
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

      const hashedPassword = CryptoJS.SHA256(
        this.loginData.PASSWORD
      ).toString();

      // Giả lập đăng nhập
      const validEmail = "nhut123@gmail.com";
      const validPasswordHash = CryptoJS.SHA256("nhut123").toString();

      if (
        (username === validEmail || username === "0123456789") &&
        hashedPassword === validPasswordHash
      ) {
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
/* Trang login chiếm full màn hình và căn giữa */
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: url("@/assets/background.jpg") no-repeat center center fixed;
  background-size: cover;
}

/* Form Container */
.form-container {
  width: 100%;
  max-width: 450px;
  background-color: rgba(30, 30, 30, 0.95);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
}

/* Logo */
.logo_Login {
  width: 140px;
  height: auto;
  margin: 0 auto 20px;
  display: block;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}

/* Tiêu đề */
h2 {
  color: #3498db;
  text-align: center;
  margin-bottom: 30px;
}

/* Form layout */
form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

label {
  color: #fff;
  font-weight: bold;
  margin-bottom: 6px;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 15px;
  outline: none;
}

input::placeholder {
  color: #999;
}

input:focus {
  border-color: #3498db;
}

/* Nút Đăng Nhập */
button {
  padding: 14px;
  background-color: #3498db;
  color: white;
  font-weight: bold;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #2980b9;
}

/* Thông báo */
.alert {
  padding: 12px;
  margin-top: 15px;
  border-radius: 6px;
  font-size: 14px;
  text-align: center;
}

.alert-success {
  background-color: #2ecc71;
  color: #fff;
}

.alert-danger {
  background-color: #e74c3c;
  color: #fff;
}

/* Responsive */
@media (max-width: 600px) {
  .form-container {
    padding: 30px 20px;
  }

  .logo_Login {
    width: 100px;
  }
}
</style>
