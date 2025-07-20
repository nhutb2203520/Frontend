<template>
  <div class="container-fluid bg-dark text-white py-5">
    <div class="text-center mb-5">
      <h2 class="text-info fw-bold display-5">SÁCH MỚI</h2>
      <div class="d-flex justify-content-center align-items-center gap-3">
        <div class="bg-info" style="width: 80px; height: 2px;"></div>
        <div class="fs-3">📖</div>
        <div class="bg-info" style="width: 80px; height: 2px;"></div>
      </div>
    </div>

    <!-- Container được thêm sự kiện mouseover/mouseleave để dừng/chạy slide -->
    <div class="book-carousel-container position-relative bg-secondary bg-opacity-25 rounded shadow px-4 py-3"
      @mouseover="stopAutoSlide" @mouseleave="startAutoSlide">
      <!-- Carousel không còn dùng transform, thay vào đó là cuộn ngang -->
      <div class="book-carousel" ref="carousel">
        <!-- Vòng lặp trực tiếp qua mảng books, không cần nhóm lại -->
        <div v-for="book in books" :key="book._id" class="book-card-wrapper">
          <BookCard :book="book" :hoverEffect="true" />
        </div>
      </div>

      <!-- Các nút bấm không còn thuộc tính disabled vì carousel có thể cuộn vô tận -->
      <button class="btn btn-info rounded-circle position-absolute top-50 start-0 translate-middle-y z-3"
        @click="prevSlide">
        ❮
      </button>
      <button class="btn btn-info rounded-circle position-absolute top-50 end-0 translate-middle-y z-3"
        @click="nextSlide">
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
  name: 'NewBook',
  components: { BookCard },
  data() {
    return {
      books: [],
      autoSlideInterval: null
    };
  },
  // Xóa bỏ 'computed: groupedBooks' và 'currentIndex'
  methods: {
    async loadBooks() {
      try {
        const bookStore = useBookStore();
        // Thay đổi API fetch sách mới
        this.books = await bookStore.fetchBooksNew();
      } catch (error) {
        console.error('Lỗi khi lấy sách mới:', error);
        this.books = [];
      }
    },
    // Hàm cuộn dùng chung
    scrollCarousel(direction) {
      const carousel = this.$refs.carousel;
      if (!carousel) return;

      const firstCard = carousel.querySelector('.book-card-wrapper');
      if (!firstCard) return;

      // Lượng cuộn = chiều rộng 1 thẻ + khoảng cách (gap)
      const scrollAmount = firstCard.offsetWidth + 16;
      carousel.scrollBy({
        left: scrollAmount * direction,
        behavior: 'smooth'
      });
    },
    nextSlide() {
      this.scrollCarousel(1);
    },
    prevSlide() {
      this.scrollCarousel(-1);
    },
    // Cập nhật logic auto-slide để cuộn vô tận
    startAutoSlide() {
      this.stopAutoSlide();
      this.autoSlideInterval = setInterval(() => {
        const carousel = this.$refs.carousel;
        if (!carousel) return;

        // Nếu đã cuộn đến cuối, quay lại đầu
        if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 1) {
          carousel.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          this.nextSlide();
        }
      }, 5000); // 5 giây
    },
    stopAutoSlide() {
      clearInterval(this.autoSlideInterval);
    }
  },
  mounted() {
    this.loadBooks().then(() => {
      // Bắt đầu auto-slide sau khi dữ liệu đã được tải
      this.startAutoSlide();
    });
  },
  beforeUnmount() {
    this.stopAutoSlide();
  }
};
</script>

<style scoped>
.book-carousel {
  display: flex;
  gap: 16px;
  /* Khoảng cách giữa các sách */
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 1rem;
  /* Tạo không gian để scrollbar (nếu hiện) không che nội dung */

  /* Ẩn thanh cuộn */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.book-carousel::-webkit-scrollbar {
  display: none;
}

.book-card-wrapper {
  scroll-snap-align: start;
  flex-shrink: 0;

  /* === CSS RESPONSIVE === */
  /* Tính toán chiều rộng chính xác cho 5 cuốn sách trên màn hình lớn */
  width: calc((100% - 64px) / 5);
  /* 4 khoảng trống * 16px = 64px */
}

@media (max-width: 1200px) {
  .book-card-wrapper {
    /* 4 cuốn sách */
    width: calc((100% - 48px) / 4);
    /* 3 khoảng trống * 16px = 48px */
  }
}

@media (max-width: 992px) {
  .book-card-wrapper {
    /* 3 cuốn sách */
    width: calc((100% - 32px) / 3);
    /* 2 khoảng trống * 16px = 32px */
  }
}

@media (max-width: 768px) {
  .book-card-wrapper {
    /* ~2 cuốn sách để gợi ý có thể cuộn */
    width: calc(100% / 2.2);
  }
}

/* Style cho các nút bấm */
button.btn-info {
  width: 40px;
  height: 40px;
  font-size: 20px;
  opacity: 0.9;
  transition: opacity 0.2s;
}

button.btn-info:hover {
  opacity: 1;
}

@media (max-width: 768px) {
  button.btn-info {
    width: 36px;
    height: 36px;
  }

  .book-carousel-container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>