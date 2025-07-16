<template>
  <div class="container-fluid bg-dark text-white py-5">
    <div class="text-center mb-5">
      <h2 class="text-info fw-bold display-5">SẢN PHẨM NỔI BẬT</h2>
      <div class="d-flex justify-content-center align-items-center gap-3">
        <div class="bg-info" style="width: 80px; height: 2px;"></div>
        <div class="fs-3">📖</div>
        <div class="bg-info" style="width: 80px; height: 2px;"></div>
      </div>
    </div>

    <div class="book-carousel-container position-relative bg-secondary bg-opacity-25 rounded shadow p-4 overflow-hidden">
      <div
        class="book-carousel d-flex transition-all"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
        ref="carousel"
      >
        <div
          v-for="(group, gIndex) in groupedBooks"
          :key="gIndex"
          class="book-slide"
          :class="{ 'justify-left': group.length < 5 }"
        >
          <div v-for="(book, index) in group" :key="index" class="book-card-wrapper">
            <BookCard :book="book" :hoverEffect="true" />
          </div>
        </div>
      </div>

      <button
        class="btn btn-info rounded-circle position-absolute top-50 start-0 translate-middle-y z-3"
        @click="prevSlide"
        :disabled="currentIndex === 0"
      >
        ❮
      </button>
      <button
        class="btn btn-info rounded-circle position-absolute top-50 end-0 translate-middle-y z-3"
        @click="nextSlide"
        :disabled="currentIndex === groupedBooks.length - 1"
      >
        ❯
      </button>
    </div>

    <p v-if="books.length === 0" class="text-warning text-center fw-bold fs-5 mt-4">
      Thư viện không có sách phù hợp.
    </p>
  </div>
</template>

<script>
import BookCard from '@/components/BookCard.vue';
import { useBookStore } from '@/Store/Book.store';

export default {
  name: 'HotBook',
  components: { BookCard },
  data() {
    return {
      books: [],
      currentIndex: 0,
      autoSlideInterval: null
    };
  },
  computed: {
    groupedBooks() {
      const groups = [];
      for (let i = 0; i < this.books.length; i += 5) {
        groups.push(this.books.slice(i, i + 5));
      }
      return groups;
    }
  },
  methods: {
    async loadBooks() {
      try {
        const bookStore = useBookStore();
        const result = await bookStore.fetchBooksHot();
        this.books = result;
      } catch (error) {
        console.error('Lỗi khi lấy sách nổi bật:', error);
        this.books = [];
      }
    },
    nextSlide() {
      if (this.currentIndex < this.groupedBooks.length - 1) {
        this.currentIndex++;
      }
    },
    prevSlide() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      }
    },
    startAutoSlide() {
      this.autoSlideInterval = setInterval(() => {
        if (this.currentIndex < this.groupedBooks.length - 1) {
          this.currentIndex++;
        } else {
          this.currentIndex = 0;
        }
      }, 5000);
    },
    stopAutoSlide() {
      clearInterval(this.autoSlideInterval);
    }
  },
  mounted() {
    this.loadBooks();
    this.startAutoSlide();
  },
  beforeUnmount() {
    this.stopAutoSlide();
  }
};
</script>

<style scoped>
.book-carousel {
  display: flex;
  transition: transform 1.2s ease;
}

.book-slide {
  width: 100%;
  min-width: 100%;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 0 8px;
}

.book-slide.justify-left {
  justify-content: left;
}

.book-card-wrapper {
  width: 20%;
  min-width: 0;
}

button.btn-info {
  width: 36px;
  height: 36px;
  font-size: 20px;
}
</style>
