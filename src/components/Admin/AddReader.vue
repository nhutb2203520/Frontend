<template>
  <div class="overlay d-flex">
   
    <div class="flex-grow-1">
    
      <div class="container-fluid px-3">
        <div class="reader-management mx-auto my-4">
          <h1 class="title">Thêm độc giả mới</h1>

          <form class="reader-form" @submit.prevent="submitReader">
            <div class="form-group">
              <label>Họ tên:</label>
              <input type="text" v-model="reader.name" required class="form-control" />
            </div>

            <div class="form-group">
              <label>Ngày sinh:</label>
              <input type="date" v-model="reader.birthdate" required class="form-control" />
            </div>

            <div class="form-group">
              <label>Giới tính:</label>
              <select v-model="reader.gender" required class="form-control">
                <option disabled value="">-- Chọn giới tính --</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div class="form-group">
              <label>Địa chỉ:</label>
              <input type="text" v-model="reader.address" required class="form-control" />
            </div>

            <div class="form-group">
              <label>Số điện thoại:</label>
              <input type="tel" v-model="reader.phone" required class="form-control" />
            </div>

            <div class="form-group">
              <label>Email:</label>
              <input type="email" v-model="reader.email" required class="form-control" />
            </div>

            <div class="form-group">
              <label>Mật khẩu cho tài khoản độc giả:</label>
              <input type="password" v-model="reader.password" required minlength="6" class="form-control" />
            </div>

            <div class="form-group">
              <label>Nhập lại mật khẩu cho tài khoản độc giả:</label>
              <input type="password" v-model="confirmPassword" required minlength="6" class="form-control" />
            </div>

            <div class="button-group d-flex flex-wrap justify-content-center gap-3 mt-4">
              <button type="button" class="cancel-btn" @click="cancelAdd">❌ Hủy</button>
              <button type="submit" class="add-btn">➕ Thêm độc giả</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>



export default {
  name: "AddReader",
  components: {  },
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
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(20, 20, 20, 0.263);
  overflow-y: auto;
  padding: 120px 20px 20px;
  z-index: 1;
}

.reader-management {

  width: 65%;
  max-width: 65%;
  background: #fff;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  font-family: 'Segoe UI', sans-serif;
  z-index: 2;
}

.title {
  text-align: center;
  font-size: 28px;
  margin-bottom: 25px;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 18px;
}

.button-group .add-btn,
.button-group .cancel-btn {
  padding: 12px 25px;
  font-weight: bold;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  transition: 0.3s;
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

/* Responsive giữ tỷ lệ khi thu nhỏ */
@media (max-width: 768px) {
  .reader-management {
    padding: 20px;
    border-radius: 12px;
  }

  .title {
    font-size: 22px;
  }

  .button-group {
    flex-direction: column;
  }

  .button-group .add-btn,
  .button-group .cancel-btn {
    width: 100%;
  }
}
</style>
