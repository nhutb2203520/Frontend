<template>
    <div class="register-page">
      <div class="form-container">
        <div class="signup-form">
          <img src="@/assets/Logo.jpg" alt="Logo" class="logo_Login" />
  
          <h2>Đăng Ký</h2>
          <form @submit.prevent="submitRegister">
            <div>
              <label for="hoten">Họ Tên:</label>
              <input type="text" id="hoten" v-model="registerData.HOTEN" required placeholder="Nhập họ và tên" />
            </div>
  
            <div>
              <label for="diachi">Địa Chỉ:</label>
              <input type="text" id="diachi" v-model="registerData.DIACHI" required placeholder="Nhập địa chỉ" />
            </div>
  
            <div>
              <label for="ngaySinh">Ngày Sinh:</label>
              <input type="date" id="ngaySinh" v-model="registerData.NGAYSINH" :max="today" required />
            </div>
  
            <div class="gender-group">
              <label>Giới Tính:</label>
              <label><input type="radio" value="Nam" v-model="registerData.GIOITINH" required /> Nam</label>
              <label><input type="radio" value="Nữ" v-model="registerData.GIOITINH" required /> Nữ</label>
            </div>
  
            <div>
              <label for="sdt">Số Điện Thoại:</label>
              <input
                type="tel"
                id="sdt"
                v-model="registerData.DIENTHOAI"
                required
                pattern="[0-9]{10}"
                placeholder="10 chữ số"
              />
            </div>
  
            <div>
              <label for="email">Email:</label>
              <input
                type="email"
                id="email"
                v-model="registerData.EMAIL"
                required
                pattern="^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$"
                placeholder="Nhập mail của bạn"
              />
            </div>
  
            <div>
              <label for="password">Mật Khẩu:</label>
              <input
                type="password"
                id="password"
                v-model="registerData.PASSWORD"
                required
                placeholder="Nhập mật khẩu"
              />
            </div>
  
            <div>
              <label for="confirm">Nhập Lại Mật Khẩu:</label>
              <input
                type="password"
                id="confirm"
                v-model="registerData.CONFIRM_PASSWORD"
                required
                placeholder="Nhập lại mật khẩu"
              />
            </div>
  
            <button type="submit">Đăng Ký</button>
          </form>
  
          <p v-if="message" :class="success ? 'success' : 'error'">{{ message }}</p>
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
  
  <style scoped>
  .register-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: url('@/assets/background.jpg') no-repeat center center fixed;
    background-size: cover;
    padding: 40px 20px;
  }
  
  .form-container {
    width: 100%;
    max-width: 1000px;
  }
  
  .signup-form {
    background-color: rgba(30, 30, 30, 0.95);
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
    color: #fff;
  }
  
  .logo_Login {
    width: 140px;
    margin: 0 auto 20px;
    display: block;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  }
  
  .signup-form h2 {
    text-align: center;
    color: #3498db;
    margin-bottom: 30px;
  }
  
  .signup-form form {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: space-between;
    text-align: left;
  }
  
  .signup-form form div {
    flex: 1 1 47%;
    display: flex;
    flex-direction: column;
  }
  
  .gender-group {
    flex: 1 1 100%;
    flex-direction: row !important;
    align-items: center;
    display: flex;
    gap: 15px;
  }
  
  label {
    font-weight: bold;
    margin-bottom: 6px;
  }
  
  input[type="text"],
  input[type="email"],
  input[type="tel"],
  input[type="password"],
  input[type="date"] {
    padding: 12px 14px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 15px;
    outline: none;
  }
  
  input:focus {
    border-color: #3498db;
  }
  
  input::placeholder {
    color: #888;
  }
  
  input[type="radio"] {
    transform: scale(1.2);
  }
  
  button {
    width: 100%;
    padding: 14px;
    background-color: #3498db;
    color: white;
    font-size: 17px;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    margin-top: 20px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #2980b9;
  }
  
  .success,
  .error {
    padding: 12px;
    margin-top: 20px;
    border-radius: 8px;
    text-align: center;
    font-size: 14px;
  }
  
  .success {
    background-color: #2ecc71;
    color: white;
  }
  
  .error {
    background-color: #e74c3c;
    color: white;
  }
  
  @media (max-width: 768px) {
    .signup-form form {
      flex-direction: column;
    }
  
    .signup-form form div {
      flex: 1 1 100%;
    }
  
    .gender-group {
      flex-direction: column !important;
      align-items: flex-start;
    }
  }
  </style>
  