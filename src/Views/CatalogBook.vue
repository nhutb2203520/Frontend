<template>
    <div class="home-wrapper position-relative  bg-light">
        <!-- Sidebar -->
        <SideBar @toggle="handleSidebarToggle" />

        <!-- Nội dung chính -->
        <div class="main-content p-3 p-md-4"
            :class="{ 'content-shifted': sidebarOpen, 'content-expanded': !sidebarOpen }">
            <HotBook />
            <NewBook />
            <BookForYou />
            <Footer />
            <Chat />
        </div>
    </div>
</template>

<script>
import SideBar from '@/components/Client/SideBar.vue';
import HotBook from '@/components/Client/HotBook.vue';
import NewBook from '@/components/Client/NewBook.vue';
import BookForYou from '@/components/Client/BookForYou.vue';
import Footer from '@/components/Client/Footer.vue';
import Chat from '@/components/Client/Chat.vue';

export default {
    name: 'Catalog',
    components: {
        SideBar,
        HotBook,
        NewBook,
        BookForYou,
        Footer,
        Chat
    },
    data() {
        return {
            sidebarOpen: true
        };
    },
    methods: {
        handleSidebarToggle(isOpen) {
            this.sidebarOpen = isOpen;
        }
    }
};
</script>

<style scoped>
/* Chỉ giữ lại CSS transition và responsive, phần còn lại dùng Bootstrap */
.main-content {
    transition: margin-left 0.3s ease;
    margin-top: 0px !important;
    position: relative;
    z-index: 1;
    padding-top: 0 !important;
    padding-left: 50px !important;
}

.content-shifted {
    margin-left: 250px;
    /* Khi sidebar mở */
}

.content-expanded {
    margin-left: 60px;
    /* Khi sidebar thu gọn */
}

/* Responsive design với Bootstrap breakpoints */
@media (max-width: 768px) {

    .content-shifted,
    .content-expanded {
        margin-left: 0;
    }

    .sidebar {
        transform: translateX(-100%);
    }

    .sidebar.show {
        transform: translateX(0);
    }
}
</style>