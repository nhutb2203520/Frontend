<template>
  <div class="container-fluid bg-dark text-white py-5" data-aos="fade-up" data-aos-duration="1000">
    <div class="text-center mb-5">
      <h2 class="text-info fw-bold display-5">GỢI Ý DÀNH CHO BẠN</h2>
      <div class="d-flex justify-content-center align-items-center gap-3">
        <div class="bg-info" style="width: 80px; height: 2px;"></div>
        <div class="fs-3">📘</div>
        <div class="bg-info" style="width: 80px; height: 2px;"></div>
      </div>
    </div>

    <div class="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-4">
      <template v-if="booksToDisplay.length > 0">
        <div v-for="(book, index) in booksToDisplay" :key="index" class="col">
          <BookCard :book="book" />
        </div>
      </template>

      <p v-else class="text-center text-warning w-100 fw-bold fs-5 mt-3">Thư viện không có sách phù hợp.</p>
    </div>

    <!-- Nút xem thêm -->
    <div class="text-center mt-4" v-if="booksToDisplay.length > 0">
      <button
        class="btn btn-outline-info"
        :disabled="booksToDisplay.length >= books.length"
        @click="loadMoreBooks"
      >
        Xem thêm
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import BookCard from '@/components/BookCard.vue';
import { useBookStore } from '@/Store/Book.store';
import { toRefs } from 'vue';

// Props lọc sách
const props = defineProps({
  selectedAuthor: String,
  selectedGenre: String,
  selectedPublisher: String,
  selectedYear: String
});
const { selectedAuthor, selectedGenre, selectedPublisher, selectedYear } = toRefs(props);

// Dữ liệu reactive
const allBooks = ref([]);
const books = ref([]);
const booksToDisplay = ref([]);
const displayCount = ref(10);

// Hàm lọc
const filterBooks = () => {
  const author = selectedAuthor.value?.toLowerCase();
  const genre = selectedGenre.value?.toLowerCase();
  const publisher = selectedPublisher.value?.toLowerCase();
  const year = selectedYear.value;

  books.value = allBooks.value.filter(book => {
    const matchAuthor = !author || (Array.isArray(book.TacGia) &&
      book.TacGia.some(tg => tg.TenTG?.toLowerCase().includes(author)));
    const matchGenre = !genre || book.MaLoai?.TenLoai?.toLowerCase().includes(genre);
    const matchPublisher = !publisher || book.MaNXB?.TenNXB?.toLowerCase().includes(publisher);
    const matchYear = !year || String(book.NamXuatBan) === year;

    return matchAuthor && matchGenre && matchPublisher && matchYear;
  });

  displayCount.value = 10;
  booksToDisplay.value = books.value.slice(0, displayCount.value);
};

// Xem thêm
const loadMoreBooks = () => {
  displayCount.value += 10;
  booksToDisplay.value = books.value.slice(0, displayCount.value);
};

// Theo dõi thay đổi filter
watch([selectedAuthor, selectedGenre, selectedPublisher, selectedYear], filterBooks);

// Lấy sách khi mount
onMounted(async () => {
  try {
    const bookStore = useBookStore();
    const result = await bookStore.fetchBooks();
    allBooks.value = result.danhsachsach ?? [];
    books.value = [...allBooks.value];
    booksToDisplay.value = books.value.slice(0, displayCount.value);
  } catch (error) {
    console.error('Lỗi khi lấy sách gợi ý:', error);
    books.value = [];
    booksToDisplay.value = [];
  }
});
</script>

<style scoped>
.ratio img {
  object-fit: cover;
}
</style>
