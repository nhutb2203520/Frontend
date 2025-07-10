<template>
  <nav class="navbar">
    <div class="container-fluid d-flex justify-content-between align-items-center">
      <!-- Logo bên trái -->
      <div class="navbar-left">
        <router-link to="/homeadmin" class="navbar-logo">
          <img src="@/assets/Logo.jpg" alt="Logo" class="logo" />
          <span class="title">QUẢN LÝ THƯ VIỆN NLN</span>
        </router-link>
      </div>

      <!-- Menu giữa (ẩn trên mobile) -->
      <ul class="navbar-menu d-none d-lg-flex">
        <li>
          <router-link to="/homeadmin" :class="{ active: $route.path === '/homeadmin' }">
            Trang Tổng Quan
          </router-link>
        </li>
      </ul>

      <!-- Phần bên phải -->
      <div class="navbar-right d-flex align-items-center gap-3">
        <!-- Tài khoản -->
        <div class="account-link" @click="toggleAccountMenu">
          <img src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png" alt="User Icon" />
          <span>Tài Khoản Thủ Thư</span>

          <div v-if="showAccountMenu" class="account-dropdown">
            <template v-if="isLoggedIn">
              <p>Xin chào, {{ userInfo.name }}</p>
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

<script>
export default {
  name: "NavBarAd",
  data() {
    return {
      showAccountMenu: false,
      showMobileMenu: false,
      isLoggedIn: false,
      userInfo: {
        name: "",
      },
    };
  },
  created() {
    const adminStr = sessionStorage.getItem("adminInfo");
    if (adminStr) {
      try {
        const admin = JSON.parse(adminStr);
        this.isLoggedIn = true;
        this.userInfo.name = admin.HoTenNV || "Không rõ";
      } catch (error) {
        console.error("❌ Lỗi đọc adminInfo:", error);
      }
    }
  },
  methods: {
    toggleAccountMenu() {
      this.showAccountMenu = !this.showAccountMenu;
    },
    toggleMobileMenu() {
      this.showMobileMenu = !this.showMobileMenu;
    },
    logout() {
      sessionStorage.clear();
      this.isLoggedIn = false;
      this.showAccountMenu = false;
      this.$router.push("/admin/signin").then(() => window.location.reload());
    },
  },
};
</script>

<style src="@/assets/navbar.css"></style>
