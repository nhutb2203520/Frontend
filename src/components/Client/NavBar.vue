<template>
    <nav class="navbar navbar-expand-lg bg-primary text-white">
        <div class="container d-flex justify-content-between align-items-center">
            <!-- Logo -->
            <div class="navbar-left d-flex align-items-center">
                <router-link to="/" class="navbar-logo d-flex align-items-center">
                    <img src="@/assets/Logo.jpg" alt="Logo" class="logo" />
                    <span class="title text-white pt-4">QUẢN LÝ THƯ VIỆN NLN</span>
                </router-link>
            </div>

            <!-- Menu giữa (chỉ hiện trên desktop) -->
            <ul class="navbar-menu d-flex d-none d-lg-flex">
                <li>
                    <router-link to="/" :class="{ active: $route.path === '/' }">Trang Chủ</router-link>
                </li>
                <li>
                    <router-link to="/catalogbook" :class="{ active: $route.path === '/catalogbook' }">Danh Mục
                        Sách</router-link>
                </li>
                <li>
                    <router-link to="/borrowinghistory" :class="{ active: $route.path === '/borrowinghistory' }">Lịch Sử
                        Mượn</router-link>
                </li>
            </ul>

            <!-- Bên phải -->
            <div class="navbar-right d-flex align-items-center gap-3">
                <!-- Tài khoản -->
                <div class="account-link" @click="toggleAccountMenu" @click.stop>
                    <img src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png" alt="User Icon" />
                    <span>Tài Khoản</span>
                    <div v-if="showAccountMenu" class="account-dropdown">
                        <template v-if="isLoggedIn">
                            <p class="text-muted mb-2">
                                Xin chào, <span class="fw-semibold fst-italic text-dark">{{ userInfo.name }}</span>
                            </p>

                            <router-link to="/account-user">Thông tin cá nhân</router-link>
                            <button @click="logout">Đăng xuất</button>
                        </template>
                        <template v-else>
                            <router-link to="/signinuser">Đăng nhập</router-link>
                            <router-link to="/signup">Đăng ký</router-link>
                        </template>
                    </div>
                </div>

                <!-- Tìm kiếm (desktop only) -->
                <div v-if="$route.path === '/catalogbook'" class="navbar-search d-none d-lg-flex">
                    <input @keyup.enter="handleSearch" type="text" v-model="searchKeyword" placeholder="Tìm kiếm ..." />
                    <button @click="handleSearch">
                        <img src="https://cdn-icons-png.flaticon.com/512/622/622669.png" alt="Search Icon" />
                    </button>
                </div>


                <!-- Nút menu thu nhỏ (mobile only) -->
                <div class="mobile-menu d-lg-none" @click.stop>
                    <button class="btn btn-light" @click="toggleMobileMenu">
                        <i class="bi bi-list"></i>
                    </button>

                    <!-- Dropdown menu mobile -->
                    <div v-if="showMobileMenu" class="mobile-dropdown bg-white text-dark shadow rounded p-3">
                        <router-link to="/" class="dropdown-item">Trang Chủ</router-link>
                        <router-link to="/catalogbook" class="dropdown-item">Danh Mục Sách</router-link>
                        <router-link to="/borrowinghistory" class="dropdown-item">Lịch Sử Mượn</router-link>

                        <div v-if="$route.path === '/catalogbook'" class="mt-2">
                            <input type="text" v-model="searchKeyword" placeholder="Tìm kiếm ..."
                                class="form-control mb-2" />
                            <button class="btn btn-primary w-100" @click="handleSearch">Tìm</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { useAuthStore } from '@/Store/auth.store';
import { useReaderStore } from '@/Store/Reader.store';
import { ElMessage } from 'element-plus';
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { onMounted, onBeforeUnmount } from 'vue';

onMounted(() => {
    window.addEventListener('click', closeMenusOutside);
});

onBeforeUnmount(() => {
    window.removeEventListener('click', closeMenusOutside);
});

function closeMenusOutside() {
    showAccountMenu.value = false;
    showMobileMenu.value = false;
}

const auth = useAuthStore();
const reader = useReaderStore();
const router = useRouter();
const route = useRoute();
const searchKeyword = ref('');
const emit = defineEmits(['resetSidebar']);
const showAccountMenu = ref(false);
const showMobileMenu = ref(false);

const isLoggedIn = computed(() => !!auth.accessToken);
const userInfo = computed(() => ({
    name: reader.infoReader || 'Người dùng'
}));

function toggleAccountMenu() {
    showAccountMenu.value = !showAccountMenu.value;
}

function toggleMobileMenu() {
    showMobileMenu.value = !showMobileMenu.value;
}

function logout() {
    auth.logout();
    ElMessage.success('Đăng xuất thành công!');
    router.push('/');
}
function handleSearch() {
    if (searchKeyword.value.trim()) {
        emit('resetSidebar');
        router.push({ path: '/catalogbook', query: { search: searchKeyword.value.trim() } });
    }
    searchKeyword.value = ''; // Xóa ô tìm kiếm sau khi tìm
}

// Tự động đóng mobile menu khi chuyển route
watch(() => route.fullPath, () => {
    showMobileMenu.value = false;
});
</script>

<style src="@/assets/navbar.css"></style>
