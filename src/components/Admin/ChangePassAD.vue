<template>
  <div class="container d-flex justify-content-center mt-5 mb-5">
    <div class="signform">
      <img src="@/assets/Logo.jpg" alt="Logo" class="logo_Login" />
      <h2>Đổi Mật Khẩu Tài Khoản Thủ Thư</h2>

      <form @submit.prevent="submitResetPassword">
        <div class="mb-3">
          <label class="form-label">Mật khẩu cũ</label>
          <input type="password" v-model="form.password" required class="form-control" placeholder="Nhập mật khẩu cũ" />
        </div>

        <div class="mb-3">
          <label class="form-label">Mật khẩu mới</label>
          <input type="password" v-model="form.newPassword" required class="form-control"
            placeholder="Nhập mật khẩu mới" />
        </div>

        <div class="mb-3">
          <label class="form-label">Nhập lại mật khẩu</label>
          <input type="password" v-model="form.rePassword" required class="form-control"
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
import { useAdminStore } from '@/Store/Admin.store'
import { ElMessage } from 'element-plus'
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const adminStore = useAdminStore()
const router = useRouter()
const form = reactive({
  password: '',
  newPassword: '',
  rePassword: ''
})

onMounted(() => {
  document.body.classList.add('login-page')
})

onBeforeUnmount(() => {
  document.body.classList.remove('login-page')
})

const submitResetPassword = async () => {
  const { password, newPassword, rePassword } = form
  if (newPassword.length < 6) {
    ElMessage.error('Mật khẩu phải có độ dài hơn 6 ký tự.')
    return
  }
  if (newPassword !== rePassword) {
    ElMessage.error('Mật khẩu nhập lại không khớp.')
    return
  }
  try {
    const data = {
      currentPassword: password,
      newPassword: newPassword
    }
    const res = await adminStore.changePassword(data)
    if (res.message === 'Đổi mật khẩu thành công.') {
      ElMessage.success('Đổi mật khẩu thành công.')
      router.push('/admin/account')
    } else {
      ElMessage.error(res.message)
    }
  } catch (err) {
    ElMessage.error('Lỗi xảy ra')
  }

}
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
