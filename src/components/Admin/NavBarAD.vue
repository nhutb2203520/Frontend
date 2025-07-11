<template>
  <nav class="navbar">
    <div class="container d-flex justify-content-between align-items-center">
      <!-- Logo bên trái -->
      <div class="navbar-left">
        <router-link to="/admin/dashboard" class="navbar-logo">
          <img src="@/assets/Logo.jpg" alt="Logo" class="logo" />
          <span class="title text-white pt-4">QUẢN LÝ THƯ VIỆN NLN</span>
        </router-link>
      </div>

      <!-- Menu giữa (ẩn trên mobile) -->
      <ul class="navbar-menu d-none d-lg-flex">
        <li>
          <router-link to="/admin/dashboard" :class="{ active: route.path === '/homeadmin' }">
            Trang Tổng Quan
          </router-link>
        </li>
      </ul>

      <!-- Phần bên phải -->
      <div class="navbar-right d-flex align-items-center gap-3">
        <!-- Tài khoản -->
        <div class="account-link" @click="toggleAccountMenu" @click.stop>
          <img src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png" alt="User Icon" />
          <span>Tài Khoản Thủ Thư</span>

          <div v-if="showAccountMenu" class="account-dropdown">
            <template v-if="isLoggedIn">
              <p class="text-muted mb-2">
                Xin chào, <span class="fw-semibold fst-italic text-dark">{{ userInfo.name }}</span>
              </p>
              <router-link to="/admin/account">Thông tin cá nhân</router-link>
              <button @click="logout">Đăng xuất</button>
            </template>
            <template v-else>
              <router-link to="/admin/signin">Đăng nhập</router-link>
            </template>
          </div>
        </div>

        <!-- Nút menu mobile -->
        <div class="mobile-menu d-lg-none">
          <button class="btn btn-light" @click="toggleMobileMenu">
            <i class="bi bi-list"></i>
          </button>

          <!-- Dropdown cho mobile -->
          <div v-if="showMobileMenu" class="mobile-dropdown">
            <router-link to="/homeadmin" class="dropdown-item">Trang Tổng Quan</router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const showAccountMenu = ref(false);
const showMobileMenu = ref(false);
const isLoggedIn = ref(false);
const userInfo = ref({
  name: '',
});
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
const toggleAccountMenu = () => {
  showAccountMenu.value = !showAccountMenu.value;
};

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const logout = () => {
  sessionStorage.clear();
  isLoggedIn.value = false;
  showAccountMenu.value = false;
  router.push('/admin/signin').then(() => window.location.reload());
};

onMounted(() => {
  const adminStr = sessionStorage.getItem('adminInfo');
  if (adminStr) {
    try {
      const admin = JSON.parse(adminStr);
      isLoggedIn.value = true;
      userInfo.value.name = admin.HoTenNV || 'Không rõ';
    } catch (error) {
      console.error('❌ Lỗi đọc adminInfo:', error);
    }
  }
});
</script>

<style src="@/assets/navbar.css"></style>
