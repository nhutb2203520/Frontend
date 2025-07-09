<template>
  <div class="background-wrapper">
    <div class="update-account">
      <h2>Cập nhật thông tin tài khoản</h2>

      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label>Họ tên:</label>
          <input v-model="form.fullName" type="text" required />
        </div>

        <div class="form-group">
          <label>Ngày sinh:</label>
          <input v-model="form.birthDate" type="date" required />
        </div>

        <div class="form-group">
          <label>Giới tính:</label>
          <select v-model="form.gender" required>
            <option disabled value="">-- Chọn giới tính --</option>
            <option>Nam</option>
            <option>Nữ</option>
            <option>Khác</option>
          </select>
        </div>

        <div class="form-group">
          <label>Số điện thoại:</label>
          <input v-model="form.phone" type="tel" pattern="[0-9]{10,11}" required />
        </div>

        <div class="form-group">
          <label>Email:</label>
          <input v-model="form.email" type="email" required />
        </div>

        <div class="form-group">
          <label>Địa chỉ:</label>
          <textarea v-model="form.address" rows="3" required></textarea>
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useReaderStore } from '@/Store/Reader.store';

const router = useRouter();
const readerStore = useReaderStore();
const form = ref({
  fullName: '',
  birthDate: '',
  gender: '',
  phone: '',
  email: '',
  address: ''
});

const loadUserInfo = async () => {
  try {
    const data = await readerStore.getMyAccount();
    form.value = {
      fullName: data.HoTen || '',
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

const validateForm = () => {
  const f = form.value;
  return (
    f.fullName &&
    f.birthDate &&
    f.gender &&
    /^\d{10,11}$/.test(f.phone) &&
    f.email.includes('@') &&
    f.address
  );
};

const submitForm = async () => {
  if (!validateForm()) {
    ElMessage.warning('Vui lòng nhập đầy đủ và đúng thông tin!');
    return;
  }

  try {
    const res = await readerStore.updateAccount({
      HoTen: form.value.fullName,
      NgaySinh: form.value.birthDate,
      Phai: form.value.gender,
      SoDienThoai: form.value.phone,
      Email: form.value.email,
      DiaChi: form.value.address
    });
    console.log(res.message)
    if (res.message === 'Cập nhật tài khoản thành công.') {
      ElMessage.success('Cập nhật thông tin thành công!');
      router.push('/account-user');
    } else {
      ElMessage.warning(res.message);
      return;
    }
  } catch (err) {
    ElMessage.error(err.response?.data?.message || 'Cập nhật thất bại!');
  }
};

const cancelUpdate = () => {
  router.back();
};

onMounted(() => {
  loadUserInfo();
});
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