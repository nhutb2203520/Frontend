<template>
  <div class="container-fluid bg-dark text-white py-5" data-aos="fade-up" data-aos-duration="1000">
    <div class="text-center mb-5">
      <h2 class="text-info fw-bold display-5">SÁCH MỚI</h2>
      <div class="d-flex justify-content-center align-items-center gap-3">
        <div class="bg-info" style="width: 80px; height: 2px;"></div>
        <div class="fs-3">📖</div>
        <div class="bg-info" style="width: 80px; height: 2px;"></div>
      </div>
    </div>

    <div class="position-relative bg-secondary bg-opacity-25 rounded shadow p-4 overflow-hidden">
      <div class="row g-4 flex-nowrap overflow-hidden" style="transition: transform 0.6s;"
        :style="{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }">
        <div v-for="(book, index) in books" :key="index" class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
          <!-- 🔁 Tái sử dụng BookCard.vue -->
          <BookCard :book="book" />
        </div>
      </div>

      <button class="btn btn-info rounded-circle position-absolute top-50 start-0 translate-middle-y" @click="prevSlide"
        :disabled="currentIndex === 0">❮</button>
      <button class="btn btn-info rounded-circle position-absolute top-50 end-0 translate-middle-y" @click="nextSlide"
        :disabled="currentIndex >= maxIndex">❯</button>
    </div>

    <div class="d-flex justify-content-center gap-3 mt-4">
      <span v-for="(dot, index) in Math.ceil(books.length / itemsPerView)" :key="index" class="rounded-circle" :class="['bg-info', {
        'opacity-100': Math.floor(currentIndex / itemsPerView) === index,
        'opacity-50': Math.floor(currentIndex / itemsPerView) !== index
      }]" style="width: 12px; height: 12px; cursor: pointer; transition: all 0.3s;"
        @click="goToSlide(index * itemsPerView)">
      </span>
    </div>
  </div>
</template>

<script>
import BookCard from '@/components/BookCard.vue';
import { useBookStore } from '@/Store/Book.store';
export default {
  name: 'NewBook',
  components: {
    BookCard
  },
  data() {
    return {
      currentIndex: 0,
      itemsPerView: 5,
      books: []
    };
  },
  computed: {
    maxIndex() {
      return Math.max(0, this.books.length - this.itemsPerView);
    }
  },
  methods: {
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
      const result = await bookStore.fetchBooksNew(); // Giả sử có phương thức fetchNewBooks trong Book.store;
      this.books = result;
      console.log('Sách mới:', this.books);
    } catch (error) {
      console.error('Lỗi khi lấy sách mới:', error);
      this.books = []; // Đặt mảng sách là rỗng nếu có lỗi
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
</style>
