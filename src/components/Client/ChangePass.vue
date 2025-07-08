<template>
  <div class="container d-flex justify-content-center mt-5 mb-5">
    <div class="signform">
      <img src="@/assets/Logo.jpg" alt="Logo" class="logo_Login" />

      <!-- 🔔 Thông báo -->
      <p v-if="message" :class="['alert', success ? 'alert-success' : 'alert-danger']" role="alert">
        {{ message }}
      </p>

      <h2>Đổi Mật Khẩu</h2>
      <form @submit.prevent="submitResetPassword">
        <!-- SĐT hoặc Email -->
        <div class="mb-3">
          <label class="form-label">Số điện thoại / Email</label>
          <input type="text" v-model="form.username" required class="form-control"
            placeholder="Nhập số điện thoại hoặc email" />
        </div>
        <div class="mb-3">
          <label class="form-label">Mật khẩu cũ</label>
          <input type="password" v-model="form.password" required class="form-control"
            placeholder="Nhập mật khẩu cũ" />
        </div>
        <!-- Mật khẩu mới -->
        <div class="mb-3">
          <label class="form-label">Mật khẩu mới</label>
          <input type="password" v-model="form.password" required class="form-control"
            placeholder="Nhập mật khẩu mới" />
        </div>

        <!-- Nhập lại mật khẩu -->
        <div class="mb-3">
          <label class="form-label">Nhập lại mật khẩu</label>
          <input type="password" v-model="form.rePassword" required class="form-control"
            placeholder="Nhập lại mật khẩu" />
        </div>

        <button type="submit" class="btn btn-primary w-100">
          Đổi Mật Khẩu
        </button>
      </form>
     
    </div>
  </div>
</template>

<script>
import CryptoJS from "crypto-js";

export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
        rePassword: "",
      },
      message: "",
      success: false,
    };
  },
  mounted() {
    document.body.classList.add("login-page");
  },
  beforeUnmount() {
    document.body.classList.remove("login-page");
  },
  methods: {
    submitResetPassword() {
      const { username, password, rePassword } = this.form;
      const isPhone = /^[0-9]{10}$/.test(username);
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(username);

      if (!isPhone && !isEmail) {
        this.message =
          "Vui lòng nhập đúng số điện thoại hoặc địa chỉ email hợp lệ!";
        this.success = false;
        return;
      }

      if (password !== rePassword) {
        this.message = "Mật khẩu nhập lại không khớp!";
        this.success = false;
        return;
      }

      // 🔒 Giả lập hash mật khẩu và xử lý
      const hashedPassword = CryptoJS.SHA256(password).toString();
      console.log("Mật khẩu mã hóa:", hashedPassword);

      this.message = "Đổi mật khẩu thành công!";
      this.success = true;

      setTimeout(() => {
        this.$router.push("/signinuser");
      }, 2000);
    },
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
  width: 100%;
}

.logo_Login {
  width: 100px;
  margin: 0 auto 20px;
  display: block;
}
</style>