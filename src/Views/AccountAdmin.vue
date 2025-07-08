<template>
  <div class="background-wrapper">
    <div class="account-info-container">
      <div class="avatar">
        <img src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png" alt="User Avatar" />
      </div>
      <h2>Tài Khoản Thủ Thư</h2>
      <div class="info-box">
        <p class="info-text">Thông tin chi tiết tài khoản</p>
      </div>

      <div class="action-buttons">
        <button class="action-btn update" @click="$router.push('/admin/account/update-account-ad')">
          Cập nhật
        </button>
        <button class="action-btn password" @click="$router.push('/admin/account/change-pass-ad')">
          Đổi mật khẩu
        </button>
        <button class="action-btn delete" @click="handleDeleteAccount">
          Xóa tài khoản
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ElMessageBox, ElMessage } from "element-plus";

export default {
  name: "AccountInfor",
  methods: {
    handleDeleteAccount() {
      ElMessageBox.confirm(
        "Bạn có chắc chắn muốn xóa tài khoản này không? Hành động này sẽ không thể hoàn tác.",
        "Xác nhận xóa tài khoản",
        {
          confirmButtonText: "Xác nhận",
          cancelButtonText: "Hủy",
          type: "warning",
        }
      )
        .then(() => {
          // TODO: Gọi API xóa tài khoản tại đây
          // Ví dụ: await axios.delete(`/api/account/delete/${id}`)
          ElMessage.success("Tài khoản đã được xóa.");
          this.$router.push("/");
        })
        .catch(() => {
          ElMessage.info("Hủy xóa tài khoản.");
        });
    },
  },
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
</style>
