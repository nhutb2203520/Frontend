<template>
    <div class="home-wrapper position-relative bg-light">
        <!-- Thanh điều hướng -->
        <NavBar @resetSidebar="handleSidebarReset" />

        <!-- Sidebar lọc -->
        <SideBar ref="sidebarRef" @toggle="handleSidebarToggle" @authorSelected="handleAuthor"
            @genreSelected="handleGenre" @publisherSelected="handlePublisher" @yearSelected="handleYear"
            @allBooks="handleAllBooks" />

        <!-- Nội dung chính -->
        <div class="main-content p-3 p-md-4"
            :class="{ 'content-shifted': sidebarOpen, 'content-expanded': !sidebarOpen }">

            <!-- Nếu có bộ lọc được chọn thì hiện kết quả tìm kiếm -->
            <SearchBook v-if="shouldShowSearch" :searchKeyword="searchKeyword" :selectedAuthor="selectedAuthor"
                :selectedGenre="selectedGenre" :selectedPublisher="selectedPublisher" :selectedYear="selectedYear" />

            <!-- Nếu không có bộ lọc, hiện trang chủ dạng danh mục -->
            <template v-else>
                <HotBook />
                <NewBook />
                <BookForYou />
            </template>

            <Footer />
            <Chat />
            <div data-aos="fade-left" data-aos-duration="1000" v-if="showAssistantMessage"
                class="assistant-bubble shadow rounded d-flex align-items-start">
                <div class="message-text">
                    🧠 <strong>Tôi là trợ lý ảo của thư viện</strong><br />
                    Bạn cần giúp gì?
                </div>
                <button @click="showAssistantMessage = false" class="btn-close btn-sm ms-2 mt-1"
                    aria-label="Close"></button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useSearchFilterStore } from '@/Store/SearchFilter.store';

import NavBar from '@/components/Client/NavBar.vue';
import SideBar from '@/components/Client/SideBar.vue';
import HotBook from '@/components/Client/HotBook.vue';
import NewBook from '@/components/Client/NewBook.vue';
import BookForYou from '@/components/Client/BookForYou.vue';
import SearchBook from '@/components/Client/SearchBook.vue';
import Footer from '@/components/Client/Footer.vue';
import Chat from '@/components/Client/Chat.vue';
const showAssistantMessage = ref(true);

const route = useRoute();
const sidebarRef = ref(null);
const sidebarOpen = ref(true);

// Pinia store chứa các filter toàn cục
const filterStore = useSearchFilterStore();
const {
    selectedAuthor,
    selectedGenre,
    selectedPublisher,
    selectedYear,
    searchKeyword
} = storeToRefs(filterStore);

// Đọc query param "search" từ URL để đồng bộ keyword
watch(() => route.query.search, (newSearch) => {
    searchKeyword.value = newSearch || '';
}, { immediate: true });
watch(
    () => route.query.reset,
    (newVal) => {
        if (newVal) {
            filterStore.clearAll(); // Hàm bạn đã có
            // Xóa query khỏi URL (nếu muốn)
            window.history.replaceState(null, '', '/catalogbook');
        }
    },
    { immediate: true }
);
// Hiển thị SearchBook khi có bất kỳ filter nào
const shouldShowSearch = computed(() =>
    !!searchKeyword.value ||
    !!selectedAuthor.value ||
    !!selectedGenre.value ||
    !!selectedPublisher.value ||
    !!selectedYear.value
);

// Các hàm xử lý sự kiện từ SideBar
function handleSidebarReset() {
    sidebarRef.value?.resetSidebarSelections();
}

function handleSidebarToggle(isOpen) {
    sidebarOpen.value = isOpen;
}

function handleAuthor(author) {
    selectedAuthor.value = author;
    selectedGenre.value = null;
    selectedPublisher.value = null;
    selectedYear.value = null;
    searchKeyword.value = '';
}

function handleGenre(genre) {
    selectedGenre.value = genre;
    selectedAuthor.value = null;
    selectedPublisher.value = null;
    selectedYear.value = null;
    searchKeyword.value = '';
}

function handlePublisher(publisher) {
    selectedPublisher.value = publisher;
    selectedAuthor.value = null;
    selectedGenre.value = null;
    selectedYear.value = null;
    searchKeyword.value = '';
}

function handleYear(year) {
    selectedYear.value = year;
    selectedAuthor.value = null;
    selectedGenre.value = null;
    selectedPublisher.value = null;
    searchKeyword.value = '';
}

function handleAllBooks() {
    selectedAuthor.value = null;
    selectedGenre.value = null;
    selectedPublisher.value = null;
    selectedYear.value = null;
    searchKeyword.value = '';
}
</script>

<style scoped>
.assistant-message {
    background-color: #e0f4ff;
    border-left: 5px solid #0dcaf0;
}

.assistant-bubble {
    position: fixed;
    bottom: 90px;
    right: 40px;
    max-width: 250px;
    height: 70px;
    background: #e0f4ff;
    border-left: 4px solid #0dcaf0;
    padding: 12px 12px;
    font-size: 11px;
    z-index: 1050;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
}

.assistant-bubble:hover {
    background-color: #91d0ff;
    transform: scale(1.1) rotate(1.5deg);
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.45);
}


.main-content {
    transition: margin-left 0.3s ease;
    margin-top: 0 !important;
    position: relative;
    z-index: 1;
    padding-top: 0 !important;
    padding-left: 25px !important;
}

.content-shifted {
    margin-left: 250px;
}

.content-expanded {
    margin-left: 60px;
}

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
