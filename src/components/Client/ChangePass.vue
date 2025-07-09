<template>
  <div class="container d-flex justify-content-center mt-5 mb-5">
    <div class="signform">
      <img src="@/assets/Logo.jpg" alt="Logo" class="logo_Login" />
      <h2>Đổi Mật Khẩu</h2>

      <form @submit.prevent="submitResetPassword">
        <!-- Mật khẩu cũ -->
        <div class="mb-3">
          <label class="form-label">Mật khẩu cũ</label>
          <input type="password" v-model="form.currentPassword" required class="form-control"
            placeholder="Nhập mật khẩu cũ" />
        </div>

        <!-- Mật khẩu mới -->
        <div class="mb-3">
          <label class="form-label">Mật khẩu mới</label>
          <input type="password" v-model="form.newPassword" required class="form-control"
            placeholder="Nhập mật khẩu mới" />
        </div>

        <!-- Nhập lại mật khẩu -->
        <div class="mb-3">
          <label class="form-label">Nhập lại mật khẩu</label>
          <input type="password" v-model="form.validateNewPassword" required class="form-control"
            placeholder="Nhập lại mật khẩu" />
        </div>

        <button type="submit" class="btn btn-primary w-100">
          Đổi Mật Khẩu
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useReaderStore } from '../../Store/Reader.store';
import { ElMessage } from 'element-plus';

const router = useRouter();
const readerStore = useReaderStore();

const form = ref({
  currentPassword: '',
  newPassword: '',
  validateNewPassword: '',
});

const submitResetPassword = async () => {
  const { currentPassword, newPassword, validateNewPassword } = form.value;
  if (newPassword.length < 6) {
    ElMessage.error('Mật khẩu mới phải có ít nhất 6 ký tự!');
    return;
  }
  if (newPassword !== validateNewPassword) {
    ElMessage.error('Mật khẩu nhập lại không khớp!');
    return;
  }

  try {
    const res = await readerStore.changePassword(currentPassword, newPassword);
    if (res.message === 'Đổi mật khẩu thành công.') {
      ElMessage.success('Đổi mật khẩu thành công!');
      router.push('/account-user');
    } else {
      ElMessage.error(res.message || 'Đổi mật khẩu thất bại!');
      return;
    }
  } catch (error) {
    const msg = error?.response?.data?.message || 'Đổi mật khẩu thất bại!';
    ElMessage.error(msg);
  }
};

onMounted(() => {
  document.body.classList.add('login-page');
});

onBeforeUnmount(() => {
  document.body.classList.remove('login-page');
});
</script>


<style scoped>
@import "@/assets/sign.css";

.signform {
  background-color: rgba(30, 30, 30, 0.9);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 400px;
  width: 100%;
}

.logo_Login {
  width: 100px;
  margin: 0 auto 20px;
  display: block;
}
</style>
