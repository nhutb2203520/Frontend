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
      <template v-if="books.length > 0">
        <div v-for="(book, index) in books" :key="index" class="col">
          <BookCard :book="book" />
        </div>
      </template>

      <p v-else class="text-center text-warning w-100 fw-bold fs-5 mt-3">Thư viện không có sách phù hợp.</p>
    </div>

  </div>
</template>

<script>
import BookCard from '@/components/BookCard.vue';
import { useBookStore } from '@/Store/Book.store';

export default {
  name: 'BookForYou',
  components: {
    BookCard
  },
  props: {
    selectedAuthor: {
      type: String,
      default: null
    },
    selectedGenre: {
      type: String,
      default: null
    },
    selectedPublisher: {
      type: String,
      default: null
    },
    selectedYear: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      allBooks: [],   // chứa toàn bộ sách
      books: []       // chứa sách được hiển thị sau lọc
    };
  },
  watch: {
    selectedAuthor: 'filterBooks',
    selectedGenre: 'filterBooks',
    selectedPublisher: 'filterBooks',
    selectedYear: 'filterBooks'
  },
  methods: {
    filterBooks() {
      const author = this.selectedAuthor?.toLowerCase();
      const genre = this.selectedGenre?.toLowerCase();
      const publisher = this.selectedPublisher?.toLowerCase();
      const year = this.selectedYear;

      this.books = this.allBooks.filter(book => {
        const matchAuthor = !author || (Array.isArray(book.TacGia) &&
          book.TacGia.some(tg => tg.TenTG?.toLowerCase().includes(author)));
        const matchGenre = !genre || book.MaLoai?.TenLoai?.toLowerCase().includes(genre);
        const matchPublisher = !publisher || book.MaNXB?.TenNXB?.toLowerCase().includes(publisher);
        const matchYear = !year || String(book.NamXuatBan) === year;

        return matchAuthor && matchGenre && matchPublisher && matchYear;
      });

      // Reset slide nếu cần
      this.currentIndex = 0;
    }
  },
  async mounted() {
    try {
      const bookStore = useBookStore();
      const result = await bookStore.fetchBooks();
      this.allBooks = result.danhsachsach;
      this.books = result.danhsachsach; // Khởi tạo sách hiển thị là toàn bộ sách
    } catch (error) {
      console.error('Lỗi khi lấy sách gợi ý:', error);
      this.books = [];
    }
  }
};
</script>


<style scoped>
.ratio img {
  object-fit: cover;
}
</style>
