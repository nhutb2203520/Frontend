<template>
    <div>
      <!-- Navbar cho tài khoản thủ thư -->
      <NavBarAD />
  
      <!-- Phần hiển thị thông tin tài khoản -->
      <div class="account-info-container">
        <div class="avatar">
          <img src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png" alt="User Avatar" />
        </div>
  
        <h2>Tài Khoản Thủ Thư</h2>
  
        <div class="info-box">
          <p class="info-text">Thông tin chi tiết tài khoản</p>
        </div>
  
        <div class="action-buttons">
          <button class="action-btn update">Cập nhật</button>
          <button class="action-btn password">Đổi mật khẩu</button>
          <button class="action-btn delete">Xóa tài khoản</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import NavBarAD from "@/components/Admin/NavBarAD.vue";
  
  export default {
    name: "AccountInfor",
    components: {
      NavBarAD
    }
  };
  </script>
  
<style scoped>
.account-info-container {
  width: 90%;
  max-width: 900px;
  margin: 10px auto;
  border-radius: 16px;
  padding: 50px 40px;
  box-sizing: border-box;
  text-align: center;
  font-family: 'Segoe UI', sans-serif;
  background: rgba(0, 0, 0, 0.75); /* Nền đen mờ */
  color: white;
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
  border: 2px solid #ccc;
  padding: 60px 30px;
  margin-top: 60px;
  min-height: 250px;
  background-color: #444;
  border-radius: 12px;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.4);
}

.info-text {
  font-style: italic;
  font-size: 22px;
  color: #eee;
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
  border: 2px solid white;
  background-color: transparent;
  color: white;
}

.action-btn:hover {
  background-color: #5a5a5a;
}

.action-btn.delete {
  color: #ff4d4d;
  border-color: #ff4d4d;
}

.action-btn.delete:hover {
  background-color: #7b0000;
  color: #fff;
}

</style>