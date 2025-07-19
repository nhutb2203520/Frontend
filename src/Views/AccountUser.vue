<template>
  <div class="background-wrapper">
    <div class="account-info-container">
      <div class="avatar">
        <img src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png" alt="User Avatar" />
      </div>
      <h2>Tài Khoản Độc Giả</h2>
      <div class="info-box">
        <p class="info-text">Thông tin tài khoản</p>
        <div class="account-details"></div>
        <p v-if="userInfo"><el-icon>
            <UserFilled />
          </el-icon> <strong>Họ tên:</strong> {{ capitalizeWords(userInfo.HoTen) }}</p>
        <p v-if="userInfo && userInfo.NgaySinh">
          <el-icon>
            <Calendar />
          </el-icon>
          <strong>Ngày sinh:</strong> {{ formatDate(userInfo.NgaySinh) }}
        </p>

        <p v-if="userInfo"><el-icon>
            <Message />
          </el-icon> <strong>Email:</strong> {{ userInfo.Email }}</p>
        <p v-if="userInfo"><el-icon>
            <PhoneFilled />
          </el-icon> <strong>Số điện thoại:</strong> {{ userInfo.SoDienThoai }}</p>
        <p v-if="userInfo"><el-icon>
            <LocationFilled />
          </el-icon> <strong>Địa chỉ:</strong> {{ userInfo.DiaChi }}</p>
        <p v-if="userInfo"><el-icon>
            <Calendar />
          </el-icon> <strong>Ngày tạo tài khoản:</strong> {{ formatDate(userInfo.createdAt) }}</p>
        <p v-if="userInfo"><el-icon>
            <CircleCheckFilled />
          </el-icon> <strong>Trạng thái:</strong> {{ capitalizeWords(userInfo.MaTT?.TenTT) }}</p>


      </div>

      <div class="action-buttons">
        <button class="action-btn update" @click="$router.push('/account-user/update-account')">
          Cập nhật
        </button>
        <button v-if="!isGoogle" class="action-btn password" @click="$router.push('/account-user/change-password')">
          Đổi mật khẩu
        </button>
        <button class="action-btn delete" @click="handleDeleteAccount">
          Xóa tài khoản
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useReaderStore } from '@/Store/Reader.store';
import { formatDate } from '../utils/formatDate'
import { capitalizeWords } from '../utils/stringUtils'
import { useAuthStore } from '@/Store/auth.store';
import { decodeToken } from '@/utils/decode'
const userInfo = ref(null);
const authStore = useAuthStore();
const readerStore = useReaderStore();
const isGoogle = decodeToken(authStore.accessToken).type
onMounted(async () => {
  try {
    const res = await readerStore.getMyAccount();
    userInfo.value = res;
  } catch (err) {
    console.error(err);
    ElMessage.error('Không thể tải thông tin người dùng!');
  }
});
const handleDeleteAccount = async () => {
  try {
    await ElMessageBox.confirm(
      "Bạn có chắc chắn muốn xóa tài khoản này không? Hành động không thể hoàn tác.",
      "Xác nhận xóa tài khoản",
      {
        confirmButtonText: "Xác nhận",
        cancelButtonText: "Hủy",
        type: "warning",
        confirmButtonClass: 'el-button--danger'
      }
    );

    const res = await readerStore.deleteMyAccount();
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
