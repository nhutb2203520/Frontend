<template>
    <div>
        <p>Đang xử lý đăng nhập, vui lòng chờ...</p>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/Store/auth.store'
import { useReaderStore } from '@/Store/Reader.store'
import { decodeToken } from '@/utils/decode'
import { ElMessage } from 'element-plus'
const router = useRouter()
const authStore = useAuthStore()
const readerStore = useReaderStore()
onMounted(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    const refreshToken = urlParams.get('refreshToken')
    if (token && refreshToken) {
        // Nếu dùng store như Pinia/Vuex thì dispatch login tại đây
        authStore.setTokens(token, refreshToken)
        readerStore.setInfoReader(decodeToken(token).HoTen)
        // Điều hướng đến dashboard
        router.push('/')
        ElMessage.success('Đăng nhập thành công.')
    } else {
        // Nếu không có token, điều hướng về trang login
        ElMessage.error('Đăng nhập thất bại.')
        router.push('/signinuser?error=authentication_failed')
    }
})
</script>
