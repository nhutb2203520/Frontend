<template>
  <div class="background-wrapper">
    <div class="update-account">
      <h2>Cập Nhật Thông Tin Tài Khoản Thủ Thư</h2>

      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label>Họ tên:</label>
          <input v-model="user.fullName" type="text" required />
        </div>

        <div class="form-group">
          <label>Ngày sinh:</label>
          <input v-model="user.birthDate" type="date" required />
        </div>

        <div class="form-group">
          <label>Giới tính:</label>
          <select v-model="user.gender" required>
            <option disabled value="">-- Chọn giới tính --</option>
            <option>Nam</option>
            <option>Nữ</option>
            <option>Khác</option>
          </select>
        </div>

        <div class="form-group">
          <label>Số điện thoại:</label>
          <input v-model="user.phone" type="tel" pattern="[0-9]{10,11}" required />
        </div>

        <div class="form-group">
          <label>Email:</label>
          <input v-model="user.email" type="email" required />
        </div>

        <div class="form-group">
          <label>Địa chỉ:</label>
          <textarea v-model="user.address" rows="3" required></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn save">💾 Lưu thay đổi</button>
          <button type="button" class="btn cancel" @click="cancelUpdate">❌ Hủy</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/Store/Admin.store'
import { ElMessage } from 'element-plus'
const router = useRouter()
const adminStore = useAdminStore()
const user = ref({
  fullName: '',
  birthDate: '',
  gender: '',
  phone: '',
  email: '',
  address: '',
})
const loadUserInfo = async () => {
  try {
    const data = await adminStore.getMyAccount();
    user.value = {
      fullName: data.HoTenNV || '',
      birthDate: data.NgaySinh?.slice(0, 10) || '', // format YYYY-MM-DD
      gender: data.Phai || '',
      phone: data.SoDienThoai || '',
      email: data.Email || '',
      address: data.DiaChi || ''
    };
  } catch (err) {
    ElMessage.error('Không thể tải thông tin tài khoản!');
  }
};
onMounted(async () => {
  await loadUserInfo()
})

function validateForm() {
  const f = user.value
  return (
    f.fullName &&
    f.birthDate &&
    f.gender &&
    /^\d{10,11}$/.test(f.phone) &&
    f.email.includes('@') &&
    f.address
  )
}

const submitForm = async () => {
  if (!validateForm()) {
    ElMessage.warning('Vui lòng nhập đầy đủ và đúng thông tin!');
    return;
  }

  try {
    const res = await adminStore.updateAccount({
      HoTenNV: user.value.fullName,
      NgaySinh: user.value.birthDate,
      Phai: user.value.gender,
      SoDienThoai: user.value.phone,
      Email: user.value.email,
      DiaChi: user.value.address
    });
    console.log(res.message)
    if (res.message === 'Cập nhật tài khoản nhân viên thành công.') {
      ElMessage.success('Cập nhật thông tin thành công!');
      router.push('/admin/account');
    } else {
      ElMessage.warning(res.message);
      return;
    }
  } catch (err) {
    ElMessage.error(err.response?.data?.message || 'Cập nhật thất bại!');
  }
};

function cancelUpdate() {
  router.back()
  ElMessage.warning('Hủy thao tác cập nhật.')
}
</script>

<style scoped>
/* NỀN TOÀN TRANG */
.background-wrapper {
  min-height: 100vh;
  background: url("@/assets/background.jpg") no-repeat center center fixed;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
}

.update-account {
  max-width: 600px;
  margin: 40px auto;
  background: #fff;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  font-family: "Segoe UI", sans-serif;
}

h2 {
  text-align: center;
  margin-bottom: 25px;
  color: #2c3e50;
  font-size: 35px;
}

.form-group {
  margin-bottom: 18px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
}

input,
select,
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
}

textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.save {
  background-color: #27ae60;
  color: white;
}

.cancel {
  background-color: #e74c3c;
  color: white;
}
</style>
