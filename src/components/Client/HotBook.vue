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

    <div class="position-relative bg-secondary bg-opacity-25 rounded shadow p-4 overflow-hidden">
      <div class="row g-4 flex-nowrap overflow-hidden" style="transition: transform 0.6s;"
        :style="{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }">
        <div v-for="(book, index) in books" :key="index" class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
          <BookCard :book="book" :hoverEffect="true" />
        </div>
      </div>

      <button class="btn btn-info rounded-circle position-absolute top-50 start-0 translate-middle-y" @click="prevSlide"
        :disabled="currentIndex === 0">❮</button>
      <button class="btn btn-info rounded-circle position-absolute top-50 end-0 translate-middle-y" @click="nextSlide"
        :disabled="currentIndex >= maxIndex">❯</button>
    </div>

    <div class="d-flex justify-content-center gap-3 mt-4">
      <span v-for="(dot, index) in Math.ceil(books.length / itemsPerView)" :key="index" class="rounded-circle" :class="[
        'bg-info',
        { 'opacity-100': Math.floor(currentIndex / itemsPerView) === index, 'opacity-50': Math.floor(currentIndex / itemsPerView) !== index }
      ]" style="width: 12px; height: 12px; cursor: pointer;" @click="goToSlide(index * itemsPerView)"></span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useBookStore } from '@/Store/Book.store';
import BookCard from '@/components/BookCard.vue';

const currentIndex = ref(0);
const itemsPerView = ref(5);
const bookStore = useBookStore();
const books = ref([]);

const maxIndex = computed(() => {
  const count = Array.isArray(books.value) ? books.value.length : 0;
  return Math.max(0, count - itemsPerView.value);
});

function updateItemsPerView() {
  const width = window.innerWidth;
  if (width < 768) itemsPerView.value = 1;
  else if (width < 1024) itemsPerView.value = 2;
  else if (width < 1200) itemsPerView.value = 3;
  else if (width < 1400) itemsPerView.value = 4;
  else itemsPerView.value = 5;

  if (currentIndex.value > maxIndex.value) {
    currentIndex.value = maxIndex.value;
  }
}

function nextSlide() {
  if (currentIndex.value < maxIndex.value) {
    currentIndex.value++;
  }
}

function prevSlide() {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
}

function goToSlide(index) {
  currentIndex.value = Math.min(index, maxIndex.value);
}

onMounted(async () => {
  updateItemsPerView();
  window.addEventListener('resize', updateItemsPerView);

  try {
    await bookStore.fetchBooksHot();
    books.value = bookStore.books;
    localStorage.setItem('hotBooks', JSON.stringify(books.value));
  } catch (err) {
    console.error('Lỗi khi fetch sách:', err);
    books.value = [];
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateItemsPerView);
});
</script>
