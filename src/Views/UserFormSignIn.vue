<template>
  <div class="container d-flex justify-content-center mt-5 mb-5">
    <div class="signform">
      <img src="@/assets/Logo.jpg" alt="Logo" class="logo_Login" />

      <h2>Đăng Nhập</h2>
      <form @submit.prevent="submitLogin">
        <!-- Username -->
        <div class="mb-3">
          <label for="username" class="form-label">Số Điện Thoại/Email</label>
          <input type="text" id="username" v-model="loginData.USERNAME" required
            placeholder="Nhập số điện thoại hoặc email" class="form-control" />
        </div>

        <!-- Mật khẩu -->
        <div class="mb-3">
          <label for="password" class="form-label">Mật Khẩu</label>
          <input type="password" id="password" v-model="loginData.PASSWORD" required placeholder="Nhập mật khẩu"
            class="form-control" />
        </div>

        <!-- Nút đăng nhập -->
        <button type="submit" class="btn btn-primary w-100">Đăng Nhập</button>
      </form>
      <div>
        <p class="mt-3 text-center">
          <router-link to="/forgot-password">Quên mật khẩu?</router-link>
        </p>
      </div>
      <div>
        <p class="mt-3 text-center">
          Chưa có tài khoản? <router-link to="/signup">Đăng ký ngay</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useReaderStore } from '@/Store/Reader.store'
import { ElMessage } from 'element-plus'

const router = useRouter()
const readerStore = useReaderStore()

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
    const result = await readerStore.login({
      identifier: username,
      Password: loginData.value.PASSWORD
    })

    if (result.message === 'Đăng nhập thành công.') {
      ElMessage.success(result.message)
      router.push('/')
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

.signform {
  background-color: rgba(30, 30, 30, 0.9);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 510px;
}
</style>
