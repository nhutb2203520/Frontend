<template>
    <nav class="navbar" data-aos="fade-down" data-aos-duration="1000">
        <div class="navbar-left">
            <router-link to="/home" class="navbar-logo">
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
                        <router-link to="/profile">Thông tin cá nhân</router-link>
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

<script>
export default {
    name: 'NavBar',
    data() {
        return {
            showAccountMenu: false,
            isLoggedIn: false, // ⚠️ sau này dùng localStorage hoặc Vuex
            userInfo: {
                name: 'Nguyễn Văn A'
            }
        };
    },
    methods: {
        toggleAccountMenu() {
            this.showAccountMenu = !this.showAccountMenu;
        },
        logout() {
            this.isLoggedIn = false;
            this.showAccountMenu = false;
            alert("Đã đăng xuất!");
            // Nếu có token/localStorage → xóa tại đây
        }
    }
};
</script>

<style src="src/assets/navbar.css"></style>
