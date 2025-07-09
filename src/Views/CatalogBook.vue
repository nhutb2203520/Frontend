<template>
    <div class="home-wrapper position-relative  bg-light">
        <!-- Sidebar -->
        <SideBar @toggle="handleSidebarToggle" @authorSelected="handleAuthor" @genreSelected="handleGenre"
            @publisherSelected="handlePublisher" @yearSelected="handleYear" @allBooks="handleAllBooks" />

        <!-- Nội dung chính -->
        <div class="main-content p-3 p-md-4"
            :class="{ 'content-shifted': sidebarOpen, 'content-expanded': !sidebarOpen }">
            <SearchBook v-if="searchStore.keyword" :searchKeyword="searchStore.keyword" :selectedAuthor="selectedAuthor"
                :selectedGenre="selectedGenre" :selectedPublisher="selectedPublisher" :selectedYear="selectedYear" />
            <template v-else>
                <HotBook :selectedAuthor="selectedAuthor" :selectedGenre="selectedGenre"
                    :selectedPublisher="selectedPublisher" :selectedYear="selectedYear" />
                <NewBook :selectedAuthor="selectedAuthor" :selectedGenre="selectedGenre"
                    :selectedPublisher="selectedPublisher" :selectedYear="selectedYear" />
                <BookForYou :selectedAuthor="selectedAuthor" :selectedGenre="selectedGenre"
                    :selectedPublisher="selectedPublisher" :selectedYear="selectedYear" />
            </template>

            <Footer />
            <Chat />
        </div>
    </div>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import SideBar from '@/components/Client/SideBar.vue';
import HotBook from '@/components/Client/HotBook.vue';
import NewBook from '@/components/Client/NewBook.vue';
import BookForYou from '@/components/Client/BookForYou.vue';
import Footer from '@/components/Client/Footer.vue';
import Chat from '@/components/Client/Chat.vue';
import SearchBook from '@/components/Client/SearchBook.vue';
import { useSearchStore } from '@/Store/search.store';

const route = useRoute();
const searchStore = useSearchStore();
const sidebarOpen = ref(true);
const selectedAuthor = ref(null);
const selectedGenre = ref(null);
const selectedPublisher = ref(null);
const selectedYear = ref(null);
const searchKeyword = ref('');

// Đọc từ khóa tìm kiếm từ URL (query param)
watch(() => route.query.search, (newSearch) => {
    searchKeyword.value = newSearch || '';
}, { immediate: true });


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
/* Chỉ giữ lại CSS transition và responsive, phần còn lại dùng Bootstrap */
.main-content {
    transition: margin-left 0.3s ease;
    margin-top: 0px !important;
    position: relative;
    z-index: 1;
    padding-top: 0 !important;
    padding-left: 25px !important;
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