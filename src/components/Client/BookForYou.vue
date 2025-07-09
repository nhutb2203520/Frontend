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

      <p v-else class="text-center text-warning w-100">Thư viện không có sách phù hợp.</p>
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
    }
  },
  data() {
    return {
      allBooks: [],   // chứa toàn bộ sách
      books: []       // chứa sách được hiển thị sau lọc
    };
  },
  watch: {
    selectedAuthor: {
      handler(newAuthor) {
        this.filterBooksByAuthor(newAuthor);
      },
      immediate: true
    },
    selectedGenre: {
      handler(newGenre) {
        this.filterBooksByGenre(newGenre);
      },
      immediate: true
    },
    selectedPublisher: {
      handler(newPublisher) {
        this.books = this.allBooks.filter(book => book.MaNXB.TenNXB.toLowerCase().includes(newPublisher.toLowerCase()));
      },
      immediate: true
    }
  },
  methods: {
    filterBooksByAuthor(author) {
      if (!author) {
        this.books = this.allBooks;
        return;
      }

      const searchTerm = author.toLowerCase();

      this.books = this.allBooks.filter(book => {
        if (!Array.isArray(book.TacGia)) return false;

        return book.TacGia.some(tg =>
          typeof tg.TenTG === 'string' && tg.TenTG.toLowerCase().includes(searchTerm)
        );
      });
    },
    filterBooksByGenre(genre) {
      if (!genre) {
        this.books = this.allBooks;
        return;
      }

      const searchTerm = genre.toLowerCase();

      this.books = this.allBooks.filter(book => book.MaLoai.TenLoai.toLowerCase().includes(searchTerm));
    }
  },
  async mounted() {
    try {
      const bookStore = useBookStore();
      const result = await bookStore.fetchBooks();
      this.allBooks = result;
      this.filterBooksByAuthor(this.selectedAuthor); // Lọc lần đầu nếu có sẵn
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
