<template>
  <div class="form-container">
    <div class="signform">
      <img src="@/assets/Logo.jpg" alt="Logo" class="logo_Login" />
      <h2>Đăng Ký</h2>

      <form @submit.prevent="submitRegister" class="register-grid">
        <!-- Họ tên -->
        <div>
          <label for="hoten">Họ Tên:</label>
          <input type="text" id="hoten" v-model="registerData.HOTEN" placeholder="Nhập họ và tên" required />
        </div>

        <!-- Địa chỉ -->
        <div>
          <label for="diachi">Địa Chỉ:</label>
          <input type="text" id="diachi" v-model="registerData.DIACHI" placeholder="Nhập địa chỉ" required />
        </div>

        <!-- Ngày sinh -->
        <div>
          <label for="ngaySinh">Ngày Sinh:</label>
          <input type="date" id="ngaySinh" v-model="registerData.NGAYSINH" :max="today" required />
        </div>

        <!-- Số điện thoại -->
        <div>
          <label for="sdt">Số Điện Thoại:</label>
          <input type="tel" id="sdt" v-model="registerData.DIENTHOAI" placeholder="10 chữ số" required
            pattern="[0-9]{10}" />
        </div>

        <!-- Giới tính -->
        <div>
          <label>Giới Tính:</label>
          <div>
            <label><input type="radio" value="Nam" v-model="registerData.GIOITINH" />Nam</label>
            <label><input type="radio" value="Nữ" v-model="registerData.GIOITINH" />Nữ</label>
          </div>
        </div>

        <!-- Email -->
        <div>
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="registerData.EMAIL" placeholder="Nhập email" required />
        </div>

        <!-- Mật khẩu -->
        <div>
          <label for="password">Mật Khẩu:</label>
          <input type="password" id="password" v-model="registerData.PASSWORD" placeholder="Nhập mật khẩu" required />
        </div>

        <!-- Nhập lại mật khẩu -->
        <div>
          <label for="confirm">Nhập Lại Mật Khẩu:</label>
          <input type="password" id="confirm" v-model="registerData.CONFIRM_PASSWORD" placeholder="Nhập lại mật khẩu"
            required />
        </div>

        <!-- Nút submit chiếm full 2 cột -->
        <div class="full-width">
          <button type="submit">Đăng Ký</button>
        </div>
      </form>

      <div v-if="message" class="mt-3">
        <div :class="success ? 'success' : 'error'">{{ message }}</div>
      </div>
    </div>
  </div>
</template>





<script>
import axios from "axios";

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
      message: "",
      success: false,
    };
  },
  methods: {
    async submitRegister() {
      if (this.registerData.PASSWORD !== this.registerData.CONFIRM_PASSWORD) {
        this.message = "Mật khẩu nhập lại không khớp!";
        this.success = false;
        return;
      }

      try {
        const response = await axios.post("http://localhost:3000/api/docgia/register", this.registerData);
        if (response.status === 201 || response.status === 200) {
          this.message = "Đăng ký thành công!";
          this.success = true;
          this.$router.push("/login");
        }
      } catch (error) {
        this.message = "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin!";
        this.success = false;
      }
    },
  },

};
</script>
<style>
@import "@/assets/sign.css";

.register-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 30px;
}

.register-grid .full-width {
  grid-column: span 2;
}

.register-grid label {
  font-weight: 600;
  margin-bottom: 8px;
  display: block;
}

.register-grid input[type="text"],
.register-grid input[type="password"],
.register-grid input[type="email"],
.register-grid input[type="tel"],
.register-grid input[type="date"] {
  width: 100%;
  padding: 15px 20px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  outline: none;
}
</style>