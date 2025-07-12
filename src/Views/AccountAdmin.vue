<template>
  <div class="background-wrapper">
    <div class="account-info-container">
      <div class="avatar">
        <img src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png" alt="User Avatar" />
      </div>
      <h2>Tài Khoản Thủ Thư</h2>
      <div class="info-box">
        <p class="info-text">Thông tin tài khoản</p>

        <p v-if="staff"><el-icon>
            <UserFilled />
          </el-icon> <strong>Họ tên:</strong> {{ capitalizeWords(staff.HoTenNV) }}</p>
        <p v-if="staff">
          <el-icon>
            <Calendar />
          </el-icon>
          <strong>Ngày sinh:</strong> {{ formatDate(staff.NgaySinh) }}
        </p>
        <p v-if="staff"><el-icon>
            <Message />
          </el-icon> <strong>Email:</strong> {{ staff.Email }}</p>
        <p v-if="staff"><el-icon>
            <PhoneFilled />
          </el-icon> <strong>Số điện thoại:</strong> {{ staff.SoDienThoai }}</p>
        <p v-if="staff"><el-icon>
            <LocationFilled />
          </el-icon> <strong>Địa chỉ:</strong> {{ staff.DiaChi }}</p>
        <p v-if="staff"><el-icon>
            <Calendar />
          </el-icon> <strong>Ngày tạo tài khoản:</strong> {{ formatDate(staff.createdAt) }}</p>
        <p v-if="staff"><el-icon>
            <User />
          </el-icon> <strong>Chức vụ:</strong> {{ staff.ChucVu }}</p>
      </div>

      <div class="action-buttons">
        <button class="action-btn update" @click="$router.push('/admin/account/update-account-ad')">Cập nhật</button>
        <button class="action-btn password" @click="$router.push('/admin/account/change-pass-ad')">Đổi mật khẩu</button>
        <button class="action-btn delete" @click="handleDeleteAccount">Xóa tài khoản</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { formatDate } from '@/utils/formatDate';
import { capitalizeWords } from '@/utils/stringUtils';
import { useAdminStore } from '@/Store/Admin.store';
import { useAuthStore } from '@/Store/auth.store';
const authStore = useAuthStore()
const staff = ref(null);
const adminStore = useAdminStore()
onMounted(async () => {
  staff.value = await adminStore.getMyAccount()

});

const handleDeleteAccount = async () => {
  try {
    await ElMessageBox.confirm(
      "Bạn có chắc chắn muốn xóa tài khoản này không? Hành động này sẽ không thể hoàn tác.",
      "Xác nhận xóa tài khoản",
      {
        confirmButtonText: "Xác nhận",
        cancelButtonText: "Hủy",
        type: "warning",
        confirmButtonClass: 'el-button--danger'
      }
    );

    const res = await adminStore.deleteMyAccount();
    if (res.message === 'Xóa tài khoản thành công.') {
      ElMessage.success("Tài khoản đã được xóa.");
      authStore.logout();
    } else {
      ElMessage.error(res.message)
    }

  } catch (err) {
    if (err !== 'cancel') {
      // Nếu không phải do cancel popup
      console.error(err);
      ElMessage.error("Không thể xóa tài khoản. Vui lòng thử lại sau.");
    } else {
      ElMessage.info("Hủy xóa tài khoản.");
    }
  }
};
</script>

<style scoped>
/* giống hoàn toàn bản đọc giả */
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
  padding: 30px 30px;
  margin-top: 60px;
  min-height: 250px;
  background-color: rgba(255, 252, 252, 0.805);
  border-radius: 12px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.4);
}

.info-text {
  font-size: 22px;
  font-weight: 700;
  color: #0b2b64;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 2px solid #0b2b64;
  padding-bottom: 4px;
  display: inline-block;
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
