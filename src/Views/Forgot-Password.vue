<template>
    <div class="container mt-5 d-flex justify-content-center">
        <div class="signform">
            <img src="../assets/Logo.jpg" alt="Ảnh logo" class="logo_Login" />
            <h2>Quên Mật Khẩu</h2>
            <form @submit.prevent="handleSubmit">
                <div class="mb-3">
                    <label for="identifier" class="form-label">Nhập Email hoặc số điện thoại
                        khẩu</label>
                    <input type="text" id="identifier" v-model="identifier" class="form-control"
                        placeholder="Nhập email hoặc số điện thoại của bạn" required />
                </div>
                <button class="btn btn-primary w-100" type="submit" :disabled="isLoading">
                    <i v-if="isLoading" class="bi bi-arrow-repeat spin"></i>
                    <span>{{ isLoading ? 'Đang gửi...' : 'Gửi Yêu Cầu' }}</span>
                </button>

            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useReaderStore } from '@/Store/Reader.store'
import { ElMessage } from 'element-plus'
import router from '@/router'

const identifier = ref('')
const isLoading = ref(false)

const handleSubmit = async () => {
    if (isLoading.value) return
    try {
        if (identifier.value.trim() === '') {
            ElMessage.warning('Vui lòng nhập email hoặc số điện thoại của bạn.')
            return
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier.value) && !/^\d{10}$/.test(identifier.value)) {
            ElMessage.warning('Vui lòng nhập email hợp lệ hoặc số điện thoại 10 chữ số.')
            return
        }

        isLoading.value = true // 👉 Bắt đầu loading

        const res = await useReaderStore().forgotPassword({
            identifier: identifier.value.trim()
        })

        if (res.message === 'Email khôi phục mật khẩu đã được gửi.') {
            ElMessage.success('Vui lòng kiểm tra email để đặt lại mật khẩu.')
            router.push('/signinuser')
        } else {
            ElMessage.error(res.message || 'Đã xảy ra lỗi khi gửi yêu cầu.')
        }

    } catch (err) {
        ElMessage.error(err.message || 'Đã xảy ra lỗi.')
    } finally {
        isLoading.value = false // 👉 Tắt loading
    }
}

</script>

<style scoped>
.signform {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    width: 600px;
    background-color: rgba(30, 30, 30, 0.9);
}

.spin {
    animation: spin 1s linear infinite;
    margin-right: 6px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
