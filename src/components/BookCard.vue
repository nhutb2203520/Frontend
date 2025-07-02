<template>
  <router-link class="text-decoration-none text-white" :to="`/book/${book.MaSach}`">
    <div
      class="bg-dark bg-opacity-75 border border-light rounded-3 p-3 h-100 d-flex flex-column align-items-center text-center book-hover">
      <div class="ratio ratio-4x3 mb-3 rounded overflow-hidden w-100">
        <img :src="book.image" :alt="book.TenSach" class="img-fluid rounded" />
      </div>
      <h5 class="text-white fw-semibold mb-3" style="min-height: 48px">
        {{ book.TenSach }}
      </h5>
      <div class="mt-auto">
        <!-- 🔗 Điều hướng tới trang chi tiết sách -->
        <router-link :to="`/book/${book.MaSach}`" class="btn btn-info rounded-pill px-4 fw-bold text-decoration-none">
          XEM CHI TIẾT
        </router-link>
      </div>
    </div>
  </router-link>
</template>

<script>
import { RouterLink } from 'vue-router';
export default {
  name: 'BookCard',
  props: {
    book: {
      type: Object,
      required: true
    },
    hoverEffect: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
.ratio img {
  object-fit: cover;
}

.book-hover {
  transition: transform 0.3s, box-shadow 0.3s;
}

.book-hover:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 24px rgba(0, 212, 255, 0.3);
  border-color: #00d4ff;
}
</style>
