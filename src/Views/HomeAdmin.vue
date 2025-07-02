<template>
    <div>
        <!-- Thanh điều hướng -->
        <NavBarAD />

        <!-- Nội dung trang tổng quan -->
        <div class="dashboard-container">
            <button class="title">Trang tổng quan</button>

            <div class="button-wrapper">
                <!-- Hàng 1: 3 nút -->
                <div class="button-row">
                    <button class="btn-box" @click="goTo('borrow')">Quản lý thông tin mượn trả sách</button>
                    <button class="btn-box" @click="goTo('genre')">Quản lý loại sách</button>
                    <button class="btn-box" @click="goTo('reader')">Quản lý độc giả</button>
                </div>

                <!-- Hàng 2: 2 nút -->
                <div class="button-row">
                    <button class="btn-box" @click="goTo('publisher')">Quản lý nhà xuất bản</button>
                    <button class="btn-box" @click="goTo('book')">Quản lý sách</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import NavBarAD from '@/components/Admin/NavBarAD.vue';

export default {
    name: 'AdminDashboard',
    components: {
        NavBarAD,
    },
    methods: {
        goTo(page) {
            const routes = {
                borrow: '/admin/borrow',
                genre: '/admin/genres',
                reader: '/admin/management-reader',
                publisher: '/admin/publishers',
                book: '/admin/books',
            };
            this.$router.push(routes[page]);
        },
    },
};
</script>

<style scoped>
.dashboard-container {
    padding: 40px 20px;
    text-align: center;
    min-height: 100vh;

    /* Ảnh nền cố định */
    background-image: url('@/assets/background_Admin.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    background-attachment: fixed;
}

.title {
    font-size: 30px;
    font-style: italic;
    margin-bottom: 40px;
    color: #ffffff;
    background-color: rgb(54, 54, 146);
    border: 2px solid #fff;
    padding: 10px 20px;
    border-radius: 10px;
}

.button-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 120px;
}

.button-row {
    display: flex;
    justify-content: center;
    gap: 120px;
    flex-wrap: wrap;
}

.btn-box {
    padding: 20px 30px;
    border: 2px solid #000;
    border-radius: 10px;
    background-color: rgba(114, 150, 203, 0.85);
    font-style: italic;
    font-size: 30px;
    cursor: pointer;
    transition: 0.3s ease;
    min-width: 220px;
}

.btn-box:hover {
    background-color: rgba(26, 55, 80, 0.95);
    transform: scale(1.05);
    color: #fff;
}
</style>
