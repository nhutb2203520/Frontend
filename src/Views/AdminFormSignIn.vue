<template>
  <div class="login-page mt-3">
    <div class="form-container">
      <div class="login-form">
        <img src="@/assets/Logo.jpg" alt="Logo" class="logo_Login" />

        <h2>Đăng Nhập Tài Khoản Thủ Thư</h2>

        <form @submit.prevent="submitLogin">
          <div>
            <label for="username">Số Điện Thoại/Email:</label>
            <input type="text" id="username" v-model="loginData.USERNAME" required
              placeholder="Nhập số điện thoại hoặc email" />
          </div>

          <div>
            <label for="password">Mật Khẩu:</label>
            <input type="password" id="password" v-model="loginData.PASSWORD" required placeholder="Nhập mật khẩu" />
          </div>

          <button type="submit">Đăng Nhập</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/Store/Admin.store'
import { ElMessage } from 'element-plus'

const router = useRouter()
const adminStore = useAdminStore()

const loginData = ref({
  USERNAME: '',
  PASSWORD: ''
})

const submitLogin = async () => {
  const username = loginData.value.USERNAME.trim()
  const isPhone = /^[0-9]{10}$/.test(username)
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(username)

  if (!isPhone && !isEmail) {
    ElMessage.warning('Vui lòng nhập số điện thoại (10 số) hoặc email hợp lệ!')
    return
  }

  try {
    const result = await adminStore.login({
      identifier: username,
      Password: loginData.value.PASSWORD
    })

    if (result.message === 'Đăng nhập thành công.') {
      ElMessage.success(result.message)
      router.push('/admin/dashboard')
    } else {
      ElMessage.error(result.message || 'Đăng nhập thất bại.')
    }
  } catch (error) {
    ElMessage.error(error.message || 'Lỗi không xác định.')
  }
}
</script>

<style scoped>
@import "@/assets/sign.css";

.login-form {
  background-color: rgba(30, 30, 30, 0.9);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 480px;
  margin: 0 auto;
}

.login-form input {
  width: 100%;
  margin-bottom: 1rem;
  padding: 8px 12px;
}

.login-form button {
  width: 100%;
  padding: 10px;
}
</style>
