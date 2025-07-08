<template>
    <nav class="navbar">
        <div class="navbar-left">
            <router-link to="/" class="navbar-logo">
                <img src="@/assets/Logo.jpg" alt="Logo" class="logo" />
                <span class="title">QUẢN LÝ THƯ VIỆN NLN</span>
            </router-link>
        </div>

        <ul class="navbar-menu">
            <li>
                <router-link to="/" :class="{ active: $route.path === '/' }">
                    Trang Chủ
                </router-link>
            </li>
            <li>
                <router-link to="/catalogbook" :class="{ active: $route.path === '/catalogbook' }">
                    Danh Mục Sách
                </router-link>
            </li>
            <li>
                <router-link to="/borrowinghistory" :class="{ active: $route.path == '/borrowinghistory' }">
                    Lịch Sử Mượn Sách
                </router-link>
            </li>
        </ul>

        <div class="navbar-right">
            <div class="account-link" @click="toggleAccountMenu">
                <img src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png" alt="User Icon" />
                <span>Tài Khoản</span>

                <div v-if="showAccountMenu" class="account-dropdown">
                    <template v-if="isLoggedIn">
                        <p>Xin chào, {{ userInfo.name }}</p>
                        <router-link to="/account-user">Thông tin cá nhân</router-link>
                        <button @click="logout">Đăng xuất</button>
                    </template>
                    <template v-else>
                        <router-link to="/signinuser">Đăng nhập</router-link>
                        <router-link to="/signup">Đăng ký</router-link>

                    </template>
                </div>
            </div>

            <div v-if="$route.path !== '/'" class="navbar-search">
                <input type="text" placeholder="Tìm kiếm ..." />
                <button>
                    <img src="https://cdn-icons-png.flaticon.com/512/622/622669.png" alt="Search Icon" />
                </button>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { useAuthStore } from '@/Store/auth.store';
import { useReaderStore } from '@/Store/Reader.store';
import { ElMessage } from 'element-plus';
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const auth = useAuthStore();
const reader = useReaderStore();

const showAccountMenu = ref(false);
const router = useRouter();

const isLoggedIn = computed(() => !!auth.accessToken);
const userInfo = computed(() => ({
    name: reader.infoReader || 'Người dùng'
}));

function toggleAccountMenu() {
    showAccountMenu.value = !showAccountMenu.value;
}

function logout() {
    auth.logout();
    ElMessage.success('Đăng xuất thành công!');
    router.push('/');
}
</script>


<style src="src/assets/navbar.css"></style>
