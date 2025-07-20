<template>
  <div class="container d-flex justify-content-center mt-5 mb-5">

    <div class="card shadow-lg p-4 w-100" style="max-width: 700px;">
      <img src="@/assets/Logo.jpg" alt="Logo" class="img-fluid mx-auto d-block mb-4 logo_Login"
        style="max-width: 150px;" />
      <h2 class="text-center mb-4" style="color: #3498db;
  margin-bottom: 35px;">Đăng Ký</h2>

      <form @submit.prevent="submitRegister">
        <!-- Dòng 1 -->
        <div class="row mb-3">
          <div class="col-md-6">
            <label for="hoten" class="form-label">Họ Tên</label>
            <input type="text" id="hoten" v-model="registerData.HOTEN" required class="form-control"
              placeholder="Nhập họ và tên" />
          </div>
          <div class="col-md-6">
            <label for="ngaySinh" class="form-label">Ngày Sinh</label>
            <input type="date" id="ngaySinh" v-model="registerData.NGAYSINH" :max="today" required
              class="form-control" />
          </div>
        </div>

        <!-- Dòng 2 -->
        <div class="row mb-3">
          <div class="col-md-6">
            <label for="sdt" class="form-label">Số Điện Thoại</label>
            <input type="tel" id="sdt" v-model="registerData.DIENTHOAI" pattern="[0-9]{10}" required
              class="form-control" placeholder="10 chữ số" />
          </div>
          <div class="col-md-6">
            <label class="form-label">Giới Tính</label>
            <div class="d-flex gap-4 mt-2">
              <div class="form-check">
                <input type="radio" class="form-check-input" value="Nam" v-model="registerData.GIOITINH" id="nam" />
                <label class="form-check-label" for="nam">Nam</label>
              </div>
              <div class="form-check">
                <input type="radio" class="form-check-input" value="Nữ" v-model="registerData.GIOITINH" id="nu" />
                <label class="form-check-label" for="nu">Nữ</label>
              </div>
            </div>
          </div>
        </div>

        <!-- Dòng 3 -->
        <div class="row mb-3">
          <div class="col-md-12">
            <label for="email" class="form-label">Email</label>
            <input type="email" id="email" v-model="registerData.EMAIL" required class="form-control"
              placeholder="Nhập email" />
          </div>
        </div>

        <!-- Dòng 4 -->
        <div class="row mb-3">
          <div class="col-md-12">
            <label for="diachi" class="form-label">Địa Chỉ</label>
            <textarea id="diachi" v-model="registerData.DIACHI" required class="form-control"
              placeholder="Nhập địa chỉ"></textarea>
          </div>
        </div>

        <!-- Dòng 5 -->
        <div class="row mb-3">
          <div class="col-md-6">
            <label for="password" class="form-label">Mật Khẩu</label>
            <input type="password" id="password" v-model="registerData.PASSWORD" placeholder="Nhập mật khẩu" required
              class="form-control" />
          </div>
          <div class="col-md-6">
            <label for="confirm" class="form-label">Nhập Lại Mật Khẩu</label>
            <input type="password" id="confirm" v-model="registerData.CONFIRM_PASSWORD" placeholder="Nhập lại mật khẩu"
              required class="form-control" />
          </div>
        </div>

        <!-- Nút Đăng Ký -->
        <button type="submit" class="btn w-100 btn-register">Đăng Ký</button>

      </form>
      <div>
        <p class="mt-3 text-center" style="color: white;">
          Đã có tài khoản? <router-link to="/signinuser">Đăng nhập ngay</router-link>
        </p>
      </div>
      <div class="divider-container">
        <div class="line"></div>
        <span class="text">HOẶC</span>
        <div class="line"></div>
      </div>
      <div class="login-container text-center">
        <a :href="googleLoginUrl" class="login-button btn btn-primary">
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" />
          <span>Tiếp tục bằng Google</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { useReaderStore } from '@/Store/Reader.store';
import { ElMessage } from 'element-plus';
export default {
  data() {
    const today = new Date().toISOString().split("T")[0];
    return {
      today,
      registerData: {
        HOTEN: "",
        DIACHI: "",
        NGAYSINH: "",
        GIOITINH: "",
        DIENTHOAI: "",
        EMAIL: "",
        PASSWORD: "",
        CONFIRM_PASSWORD: "",
      },
      googleLoginUrl: 'http://localhost:3000/auth/google'
    };
  },
  methods: {
    async submitRegister() {
      if (this.registerData.PASSWORD !== this.registerData.CONFIRM_PASSWORD) {
        ElMessage.warning("Mật khẩu và xác nhận mật khẩu không khớp.");
        return;
      }
      // Kiểm tra email hợp lệ
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(this.registerData.EMAIL)) {
        ElMessage.warning("Email không hợp lệ.");
        return;
      }
      // Kiểm tra số điện thoại hợp lệ (10 chữ số)
      const phonePattern = /^[0-9]{10}$/;
      if (!phonePattern.test(this.registerData.DIENTHOAI)) {
        ElMessage.warning("Số điện thoại không hợp lệ. Vui lòng nhập 10 chữ số.");
        return;
      }
      try {
        const readerStore = useReaderStore();
        const data = {
          HoTen: this.registerData.HOTEN,
          DiaChi: this.registerData.DIACHI,
          NgaySinh: this.registerData.NGAYSINH,
          Phai: this.registerData.GIOITINH,
          SoDienThoai: this.registerData.DIENTHOAI,
          Email: this.registerData.EMAIL,
          Password: this.registerData.PASSWORD,
        }
        const result = await readerStore.register(data);
        if (result.message === "Đăng ký tài khoản thành công.") {
          ElMessage.success(result.message);
          this.$router.push("/signinuser");
        } else {
          ElMessage.error(result.message || "Đăng ký thất bại.");
        }
      } catch (error) {
        ElMessage.error(error.message || "Lỗi không xác định.");
      }

    },
  },
};
</script>

<style>
@import "@/assets/sign.css";

.card {
  background-color: rgba(30, 30, 30, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.card label {
  color: white;
}

.divider-container {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
}

.line {
  flex-grow: 1;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.3);
}

.text {
  padding: 0 15px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.btn-register {
  background-color: #3498db;
  color: white;
  font-weight: 700;
}

.btn-register:hover {
  background-color: #4285F4;
  color: white;
}

.login-button {
  width: 445px;
  display: inline-flex;
  align-items: center;
  padding: 10px 20px;
  justify-content: center;
  border-radius: 5px;
  background-color: #4285F4;
  color: white;
  text-decoration: none;
  font-weight: bold;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
}

.login-button img {
  width: 20px;
  margin-right: 15px;
  background: white;
  padding: 2px;
  border-radius: 50%;
}

.login-container {
  margin-top: 20px;
}

.login-button:hover {
  cursor: pointer;
  background-color: #2d6fda;
}
</style>
