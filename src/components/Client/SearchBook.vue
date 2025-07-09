<template>
    <div class="container my-4">
        <h3 class="text-info fw-bold mb-3">
            Kết quả tìm kiếm cho "{{ searchKeyword }}"
        </h3>

        <div v-if="filteredBooks.length > 0" class="row g-4">
            <div v-for="(book, index) in filteredBooks" :key="index" class="col-12 col-sm-6 col-md-4 col-lg-3">
                <BookCard :book="book" :hoverEffect="true" />
            </div>
        </div>

        <p v-else class="text-warning text-center mt-4 fw-bold fs-5">
            Không tìm thấy sách phù hợp với từ khóa "{{ searchKeyword }}"
        </p>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import BookCard from '@/components/BookCard.vue';
import { useBookStore } from '@/Store/Book.store';

const bookStore = useBookStore();

// ✅ Hàm chuẩn hóa tiếng Việt (bỏ dấu, viết thường)
function normalizeText(str) {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'd');
}

// ✅ Nhận props từ component cha (CatalogBook.vue)
const props = defineProps({
    searchKeyword: String,
    selectedAuthor: String,
    selectedGenre: String,
    selectedPublisher: String,
    selectedYear: String
});

const allBooks = ref([]);
const filteredBooks = ref([]);

// ✅ Lấy toàn bộ sách từ store
async function fetchBooks() {
    try {
        const books = await bookStore.fetchBooks();
        allBooks.value = books;
        filterBooks(); // Lọc ngay sau khi load
    } catch (error) {
        console.error('Lỗi khi lấy sách:', error);
    }
}

// ✅ Hàm lọc sách theo tất cả điều kiện
function filterBooks() {
    const keyword = normalizeText(props.searchKeyword?.trim() || '');

    filteredBooks.value = allBooks.value.filter((book) => {
        const tenSach = normalizeText(book.TenSach || '');
        const tacGiaList = book.TacGia?.map((tg) => normalizeText(tg.TenTG || '')) || [];

        const matchKeyword =
            !keyword ||
            tenSach.includes(keyword) ||
            tacGiaList.some((name) => name.includes(keyword));

        const matchAuthor =
            !props.selectedAuthor ||
            (book.TacGia &&
                book.TacGia.some(
                    (tg) => normalizeText(tg.TenTG) === normalizeText(props.selectedAuthor)
                ));

        const matchGenre =
            !props.selectedGenre ||
            (book.MaLoai &&
                normalizeText(book.MaLoai.TenLoai) === normalizeText(props.selectedGenre));

        const matchPublisher =
            !props.selectedPublisher ||
            (book.MaNXB &&
                normalizeText(book.MaNXB.TenNXB) === normalizeText(props.selectedPublisher));

        const matchYear =
            !props.selectedYear || String(book.NamXuatBan) === props.selectedYear;

        return (
            matchKeyword &&
            matchAuthor &&
            matchGenre &&
            matchPublisher &&
            matchYear
        );
    });
}

// ✅ Theo dõi props để lọc lại khi có thay đổi
watch(
    () => [
        props.searchKeyword,
        props.selectedAuthor,
        props.selectedGenre,
        props.selectedPublisher,
        props.selectedYear
    ],
    filterBooks,
    { immediate: true }
);

// ✅ Gọi API khi component mounted
onMounted(fetchBooks);
</script>
