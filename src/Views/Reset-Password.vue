<template>
    <div class="container d-flex justify-content-center mt-5">
        <div class="signform">
            <img src="../assets/Logo.jpg" alt="Ảnh logo" class="logo_Login" />
            <h2>Đặt lại mật khẩu</h2>
            <form @submit.prevent="handleReset">
                <div class="mb-3">
                    <label>Mật khẩu mới</label>
                    <input v-model="password" type="password" class="form-control" placeholder="Nhập mật khẩu mới"
                        required />
                </div>
                <div class="mb-3">
                    <label>Xác nhận mật khẩu</label>
                    <input v-model="confirmPassword" type="password" placeholder="Nhập lại mật khẩu"
                        class="form-control" required />
                </div>
                <button class="btn btn-success w-100">
                    Đặt lại mật khẩu
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useReaderStore } from '@/Store/Reader.store'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const password = ref('')
const confirmPassword = ref('')

const handleReset = async () => {
    if (password.value !== confirmPassword.value) {
        ElMessage.error('Mật khẩu không khớp!')
        return
    }

    try {
        const token = route.params.token
        const res = await useReaderStore().resetPassword({
            token,
            Password: password.value.trim()
        }
        )
        ElMessage.success(res.message || 'Đặt lại mật khẩu thành công!')
        router.push('/signinuser')
    } catch (error) {
        ElMessage.error(error.response?.data?.message || 'Lỗi đặt lại mật khẩu.')
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
    display: inline-block;
}

@keyframes spin {
    from {
        transform: rotate(0);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>
