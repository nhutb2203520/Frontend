<template>
    <div class="overlay">
      <div class="reader-management">
        <h1 class="title">Thêm độc giả mới</h1>
  
        <form class="reader-form" @submit.prevent="submitReader">
          <div class="form-group">
            <label>Họ tên:</label>
            <input type="text" v-model="reader.name" required />
          </div>
  
          <div class="form-group">
            <label>Ngày sinh:</label>
            <input type="date" v-model="reader.birthdate" required />
          </div>
  
          <div class="form-group">
            <label>Giới tính:</label>
            <select v-model="reader.gender" required>
              <option disabled value="">-- Chọn giới tính --</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
  
          <div class="form-group">
            <label>Địa chỉ:</label>
            <input type="text" v-model="reader.address" required />
          </div>
  
          <div class="form-group">
            <label>Số điện thoại:</label>
            <input type="tel" v-model="reader.phone" required />
          </div>
  
          <div class="form-group">
            <label>Email:</label>
            <input type="email" v-model="reader.email" required />
          </div>
  
          <div class="form-group">
            <label>Mật khẩu cho tài khoản độc giả:</label>
            <input type="password" v-model="reader.password" required minlength="6" />
          </div>
  
          <div class="form-group">
            <label>Nhập lại mật khẩu cho tài khoản độc giả:</label>
            <input type="password" v-model="confirmPassword" required minlength="6" />
          </div>
  
          <div class="button-group">
            <button type="button" class="cancel-btn" @click="cancelAdd">❌ Hủy</button>
            <button type="submit" class="add-btn">➕ Thêm độc giả</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "AddReader",
    data() {
      return {
        reader: {
          name: "",
          birthdate: "",
          gender: "",
          address: "",
          phone: "",
          email: "",
          password: "",
        },
        confirmPassword: "",
      };
    },
    methods: {
      submitReader() {
        if (this.reader.password !== this.confirmPassword) {
          alert("❌ Mật khẩu nhập lại không khớp!");
          return;
        }
  
        console.log("✅ Độc giả mới:", this.reader);
        alert("🎉 Thêm độc giả thành công!");
        this.$router.push("/admin/management-reader");
      },
      cancelAdd() {
        if (confirm("Bạn có chắc chắn muốn hủy và quay lại danh sách độc giả?")) {
          this.$router.push("/admin/management-reader");
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Giữ nguyên phần style như bạn đã có */
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(20, 20, 20, 0.85);
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 120px 20px 20px;
    overflow-y: auto;
    z-index: 1;
  }
  
  .reader-management {
    max-width: 800px;
    width: 100%;
    background: #fff;
    padding: 30px;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
    font-family: 'Segoe UI', sans-serif;
    z-index: 2;
    position: relative;
  }
  
  .title {
    text-align: center;
    font-size: 28px;
    margin-bottom: 25px;
    color: #2c3e50;
  }
  
  .reader-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
  }
  
  .form-group label {
    margin-bottom: 6px;
    font-weight: bold;
  }
  
  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 15px;
  }
  
  .button-group {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
  }
  
  .add-btn,
  .cancel-btn {
    padding: 12px 25px;
    font-weight: bold;
    font-size: 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.3s;
    border: none;
  }
  
  .add-btn {
    background-color: #27ae60;
    color: white;
  }
  
  .add-btn:hover {
    background-color: #219150;
  }
  
  .cancel-btn {
    background-color: #e74c3c;
    color: white;
  }
  
  .cancel-btn:hover {
    background-color: #c0392b;
  }
  </style>
  