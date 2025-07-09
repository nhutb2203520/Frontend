<template>
    <nav class="navbar navbar-expand-lg bg-primary px-3 fixed-top">
      <div class="container-fluid">
        <!-- Logo -->
        <router-link to="/" class="navbar-brand d-flex align-items-center">
          <img src="@/assets/Logo.jpg" alt="Logo" class="logo me-2" />
          <span class="title">QUẢN LÝ THƯ VIỆN NLN</span>
        </router-link>
  
        <!-- Tài khoản (phía bên phải) -->
        <div class="d-flex align-items-center gap-3 order-lg-3">
          <div class="account-link position-relative" @click="toggleAccountMenu">
            <img src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png" alt="User Icon" />
            <span>Tài Khoản</span>
  
            <div v-if="showAccountMenu" class="account-dropdown">
              <template v-if="isLoggedIn">
                <p class="account-name">Xin chào, {{ userInfo.name }}</p>
                <router-link to="/account-user">Thông tin cá nhân</router-link>
                <button @click="logout">Đăng xuất</button>
              </template>
              <template v-else>
                <router-link to="/signinuser">Đăng nhập</router-link>
                <router-link to="/signup">Đăng ký</router-link>
              </template>
            </div>
          </div>
        </div>
  
        <!-- Nút toggle menu -->
        <button
          class="navbar-toggler order-lg-2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
  
        <!-- Menu điều hướng -->
        <div class="collapse navbar-collapse justify-content-center order-lg-1" id="navbarNav" ref="collapseRef">
          <ul class="navbar-nav mb-2 mb-lg-0 gap-lg-4">
            <li class="nav-item">
              <router-link to="/" class="nav-custom" :class="{ active: $route.path === '/' }">Trang Chủ</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/catalogbook" class="nav-custom" :class="{ active: $route.path === '/catalogbook' }">Danh Mục Sách</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/borrowinghistory" class="nav-custom" :class="{ active: $route.path === '/borrowinghistory' }">Lịch Sử Mượn</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { useAuthStore } from '@/Store/auth.store';
  import { useReaderStore } from '@/Store/Reader.store';
  import { ElMessage } from 'element-plus';
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  const auth = useAuthStore();
  const reader = useReaderStore();
  const router = useRouter();
  
  const showAccountMenu = ref(false);
  const collapseRef = ref(null);
  
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
  
  onMounted(() => {
    router.afterEach(() => {
      const collapse = collapseRef.value;
      if (collapse && collapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(collapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });
  </script>
  
  <style src="@/assets/navbar.css"></style>
  