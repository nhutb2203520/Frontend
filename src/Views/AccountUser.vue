<template>
  <div class="background-wrapper">
    <div class="account-info-container">
      <div class="avatar">
        <img src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png" alt="User Avatar" />
      </div>
      <h2>Tài Khoản Độc Giả</h2>
      <div class="info-box">
        <p class="info-text">Thông tin chi tiết tài khoản</p>
      </div>

      <div class="action-buttons">
        <button class="action-btn update" @click="$router.push('/account-user/update-account')">Cập nhật</button>
        <button class="action-btn password" @click="$router.push('/account-user/change-password')">Đổi mật khẩu</button>
        <button class="action-btn delete" @click="showDeletePopup = true">Xóa tài khoản</button>
      </div>
    </div>

    <!-- POPUP xác nhận xóa -->
    <div v-if="showDeletePopup" class="popup-overlay">
      <div class="popup">
        <h3>Xóa tài khoản</h3>
        <p>Nhập Email/Số điện thoại và Mật khẩu để xác nhận:</p>
        <input v-model="deleteInfo.email" type="text" placeholder="Email hoặc số điện thoại" />
        <input v-model="deleteInfo.password" type="password" placeholder="Mật khẩu" />
        <div class="popup-buttons">
          <button class="btn cancel" @click="showDeletePopup = false">❌ Hủy</button>
          <button class="btn delete" @click="confirmDelete">🗑️ Xóa tài khoản</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AccountInfor",
  data() {
    return {
      showDeletePopup: false,
      deleteInfo: {
        email: "",
        password: ""
      }
    };
  },
  methods: {
    confirmDelete() {
      if (!this.deleteInfo.email || !this.deleteInfo.password) {
        alert("⚠️ Vui lòng nhập đầy đủ Email/SĐT và Mật khẩu.");
        return;
      }

      const confirmed = confirm("❗ Bạn có chắc chắn muốn xóa tài khoản này không?");
      if (confirmed) {
        // Gọi API xoá tài khoản nếu có ở đây
        alert("✅ Tài khoản đã được xóa thành công.");
        this.$router.push("/");
      }
    }
  }
};
</script>

<style scoped>
.background-wrapper {
  min-height: 100vh;
  background: url("@/assets/background.jpg") no-repeat center center fixed;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
}

.account-info-container {
  width: 100%;
  max-width: 900px;
  border-radius: 16px;
  padding: 50px 40px;
  box-sizing: border-box;
  text-align: center;
  font-family: 'Segoe UI', sans-serif;
  background: #ffffff;
  color: #000;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
}

.avatar {
  width: 120px;
  height: 120px;
  margin: 0 auto -40px;
  background-color: #222;
  border: 3px solid #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(-50%);
}

.avatar img {
  width: 65%;
  height: auto;
  filter: invert(1);
}

.info-box {
  border: 2px solid #070606;
  padding: 60px 30px;
  margin-top: 60px;
  min-height: 250px;
  background-color: rgba(255, 252, 252, 0.805);
  border-radius: 12px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.4);
}

.info-text {
  font-style: italic;
  font-size: 22px;
  color: #000;
}

.action-buttons {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  gap: 30px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s ease;
  border: 2px solid rgb(0, 0, 0);
  background-color: rgba(83, 145, 232, 0.818);
  color: rgb(0, 0, 0);
}

.action-btn:hover {
  background-color: #5a5a5a;
  color: white;
}

.action-btn.delete {
  color: #a20000;
  border-color: #7b0000;
  font-weight: bold;
}

.action-btn.delete:hover {
  background-color: #7b0000;
  color: #fff;
}

/* POPUP overlay */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100vw;
  height: 100vh;
  background: rgba(20, 20, 20, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* POPUP nội dung */
.popup {
  background: white;
  padding: 30px;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
}

.popup input {
  width: 100%;
  padding: 12px;
  margin: 12px 0;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.popup-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.popup .btn {
  padding: 10px 20px;
  font-weight: bold;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.popup .btn.cancel {
  background-color: #7f8c8d;
  color: white;
}

.popup .btn.delete {
  background-color: #e74c3c;
  color: white;
}
</style>
