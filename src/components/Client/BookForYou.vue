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
      <div v-for="(book, index) in books" :key="index" class="col">
        <!-- 🔁 Tái sử dụng BookCard.vue -->
        <BookCard :book="book" />
      </div>
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
  data() {
    return {
      books: []
    };
  },
  async mounted() {
    try {
      const bookStore = useBookStore()
      const result = await bookStore.fetchBooks();
      this.books = result
    } catch (error) {
      console.error('Lỗi khi lấy sách gợi ý:', error);
      this.books = []; // Đặt mảng sách là rỗng nếu có lỗi
    }
  },
};
</script>

<style scoped>
.ratio img {
  object-fit: cover;
}
</style>