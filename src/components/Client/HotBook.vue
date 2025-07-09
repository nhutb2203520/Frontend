<template>
  <div class="container-fluid bg-dark text-white py-5" data-aos="fade-up" data-aos-duration="1000">
    <div class="text-center mb-5">
      <h2 class="text-info fw-bold display-5">SẢN PHẨM NỔI BẬT</h2>
      <div class="d-flex justify-content-center align-items-center gap-3">
        <div class="bg-info" style="width: 80px; height: 2px;"></div>
        <div class="fs-3">📖</div>
        <div class="bg-info" style="width: 80px; height: 2px;"></div>
      </div>
    </div>

    <div class="position-relative bg-secondary bg-opacity-25 rounded shadow p-4 overflow-hidden">
      <div v-if="books.length > 0" class="row g-4 flex-nowrap overflow-hidden" style="transition: transform 0.6s;"
        :style="{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }">
        <div v-for="(book, index) in books" :key="index" class="col-12 col-sm-6 col-md-4 col-lg-custom">
          <BookCard :book="book" :hoverEffect="true" />
        </div>
      </div>
      <p v-else class="text-warning text-center fw-bold fs-5 mt-3">Thư viện không có sách phù hợp.</p>

      <button class="btn btn-info rounded-circle position-absolute top-50 start-0 translate-middle-y" @click="prevSlide"
        :disabled="currentIndex === 0">
        ❮
      </button>
      <button class="btn btn-info rounded-circle position-absolute top-50 end-0 translate-middle-y" @click="nextSlide"
        :disabled="currentIndex >= maxIndex">
        ❯
      </button>
    </div>

    <div class="d-flex justify-content-center gap-3 mt-4">
      <span v-for="(dot, index) in Math.ceil(books.length / itemsPerView)" :key="index" class="rounded-circle" :class="[
        'bg-info',
        { 'opacity-100': Math.floor(currentIndex / itemsPerView) === index, 'opacity-50': Math.floor(currentIndex / itemsPerView) !== index }
      ]" style="width: 12px; height: 12px; cursor: pointer; transition: all 0.3s;"
        @click="goToSlide(index * itemsPerView)"></span>
    </div>
  </div>
</template>

<script>
import BookCard from '@/components/BookCard.vue';
import { useBookStore } from '@/Store/Book.store';

export default {
  name: 'HotBook',
  components: { BookCard },
  props: {
    selectedAuthor: String,
    selectedGenre: String,
    selectedPublisher: String,
    selectedYear: String
  },
  data() {
    return {
      currentIndex: 0,
      itemsPerView: 5,
      allBooks: [],
      books: []
    };
  },
  watch: {
    selectedAuthor: 'filterBooks',
    selectedGenre: 'filterBooks',
    selectedPublisher: 'filterBooks',
    selectedYear: 'filterBooks'
  },
  computed: {
    maxIndex() {
      return Math.max(0, this.books.length - this.itemsPerView);
    }
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
      this.currentIndex = 0;
    },
    nextSlide() {
      if (this.currentIndex < this.maxIndex) this.currentIndex++;
    },
    prevSlide() {
      if (this.currentIndex > 0) this.currentIndex--;
    },
    goToSlide(index) {
      this.currentIndex = Math.min(index, this.maxIndex);
    },
    updateItemsPerView() {
      const width = window.innerWidth;
      if (width < 768) this.itemsPerView = 1;
      else if (width < 1024) this.itemsPerView = 2;
      else if (width < 1200) this.itemsPerView = 3;
      else if (width < 1400) this.itemsPerView = 4;
      else this.itemsPerView = 5;

      if (this.currentIndex > this.maxIndex) {
        this.currentIndex = this.maxIndex;
      }
    }
  },
  async mounted() {
    this.updateItemsPerView();
    window.addEventListener('resize', this.updateItemsPerView);
    try {
      const bookStore = useBookStore();
      const res = await bookStore.fetchBooksHot();
      this.allBooks = res;
      this.books = res;
    } catch (error) {
      console.error('Lỗi khi lấy sách nổi bật:', error);
      this.books = [];
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateItemsPerView);
  }
};
</script>

<style scoped>
.ratio img {
  object-fit: cover;
}

@media (min-width: 992px) {
  .col-lg-custom {
    flex: 0 0 auto;
    width: 20%;
    /* 100% / 5 = 20% mỗi quyển */
  }
}
</style>
