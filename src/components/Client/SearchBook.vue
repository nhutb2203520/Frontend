<template>
    <div class="search-wrapper my-4 text-white">
        <h3 class="fw-bold mb-4">
            Kết quả tìm kiếm
            <span v-if="searchKeyword">cho từ khóa: "<strong>{{ searchKeyword }}</strong>"</span>
            <span v-else-if="selectedAuthor">từ tác giả: "<strong>{{ selectedAuthor }}</strong>"</span>
            <span v-else-if="selectedGenre">thuộc thể loại: "<strong>{{ selectedGenre }}</strong>"</span>
            <span v-else-if="selectedPublisher">từ nhà xuất bản: "<strong>{{ selectedPublisher }}</strong>"</span>
            <span v-else-if="selectedYear">năm xuất bản: "<strong>{{ selectedYear }}</strong>"</span>
        </h3>

        <div v-if="filteredBooks.length > 0" class="row g-4">
            <div v-for="(book, index) in filteredBooks" :key="index" class="col-12 col-sm-6 col-md-4 col-lg-3">
                <BookCard :book="book" :hoverEffect="true" />
            </div>
        </div>

        <p v-else class="text-warning text-center mt-4 fw-bold fs-5">
            Không tìm thấy sách phù hợp.
        </p>
    </div>
</template>

<script setup>
import { useBookStore } from '@/Store/Book.store';
import { useSearchFilterStore } from '@/Store/SearchFilter.store';
import BookCard from '@/components/BookCard.vue';
import { storeToRefs } from 'pinia';
import { ref, watch, onMounted } from 'vue';

const searchFilterStore = useSearchFilterStore();
const { searchKeyword, selectedAuthor, selectedGenre, selectedPublisher, selectedYear } = storeToRefs(searchFilterStore);
const bookStore = useBookStore();

const allBooks = ref([]);
const filteredBooks = ref([]);

function normalizeText(str) {
    return str.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'd');
}

function filterBooks() {
    const keyword = normalizeText(searchKeyword.value || '');
    const authorFilter = normalizeText(selectedAuthor.value || '');
    const genreFilter = normalizeText(selectedGenre.value || '');
    const publisherFilter = normalizeText(selectedPublisher.value || '');
    const yearFilter = selectedYear.value || '';

    filteredBooks.value = allBooks.value.filter(book => {
        const tenSach = normalizeText(book.TenSach || '');
        const tacGiaList = book.TacGia?.map(tg => normalizeText(tg.TenTG || '')) || [];
        const theLoai = normalizeText(book.MaLoai?.TenLoai || '');
        const nhaXuatBan = normalizeText(book.MaNXB?.TenNXB || '');
        const namXuatBan = String(book.NamXuatBan || '');

        if (keyword) {
            return (
                tenSach.includes(keyword) ||
                tacGiaList.some(name => name.includes(keyword)) ||
                theLoai.includes(keyword) ||
                nhaXuatBan.includes(keyword) ||
                namXuatBan.includes(keyword)
            );
        }

        return (
            (!authorFilter || tacGiaList.some(name => name.includes(authorFilter))) &&
            (!genreFilter || theLoai.includes(genreFilter)) &&
            (!publisherFilter || nhaXuatBan.includes(publisherFilter)) &&
            (!yearFilter || namXuatBan === yearFilter)
        );
    });
}

onMounted(async () => {
    allBooks.value = await bookStore.fetchBooks();
    filterBooks();
});

watch(
    [searchKeyword, selectedAuthor, selectedGenre, selectedPublisher, selectedYear],
    () => filterBooks()
);
</script>


<style scoped>
.search-wrapper {
    background-color: #1e1e2f;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 0 12px rgba(255, 255, 255, 0.05);
}

h3 {
    color: #00d4ff;
}

strong {
    color: #ffcc00;
}
</style>
