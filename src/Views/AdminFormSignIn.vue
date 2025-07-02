<template>
  <div class="login-page">
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
.login-page {
  min-height: 100vh;
  background: url("@/assets/background.jpg") no-repeat center center fixed;
  background-size: cover;

  display: flex;
  flex-direction: column;
  align-items: center;
}

.nav-wrapper {
  width: 100%;
}

.form-container {
  margin-top: 40px;
  width: 100%;
  max-width: 450px;
  background-color: rgba(30, 30, 30, 0.95);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
}

.logo_Login {
  width: 140px;
  height: auto;
  margin: 0 auto 20px;
  display: block;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}

h2 {
  color: #3498db;
  text-align: center;
  margin-bottom: 30px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

@media (max-width: 600px) {
  .form-container {
    padding: 30px 20px;
  }

  .logo_Login {
    width: 100px;
  }
}
</style>
