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
      <div v-if="books && books?.length > 0" class="row g-4 flex-nowrap overflow-hidden"
        :style="{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`, transition: 'transform 0.6s' }">
        <div v-for="(book, index) in books" :key="index" class="col-12 col-sm-6 col-md-4 col-lg-custom">
          <BookCard :book="book" :hoverEffect="true" />
        </div>
      </div>
      <p v-else class="text-warning text-center fw-bold fs-5 mt-3">Thư viện không có sách phù hợp.</p>

      <button class="btn btn-info rounded-circle position-absolute top-50 start-0 translate-middle-y" @click="prevSlide"
        :disabled="currentIndex === 0">❮</button>
      <button class="btn btn-info rounded-circle position-absolute top-50 end-0 translate-middle-y" @click="nextSlide"
        :disabled="currentIndex >= maxIndex">❯</button>
    </div>

    <div class="d-flex justify-content-center gap-3 mt-4">
      <span v-for="(dot, index) in Math.ceil(books?.length / itemsPerView)" :key="index" class="rounded-circle" :class="['bg-info', {
        'opacity-100': Math.floor(currentIndex / itemsPerView) === index,
        'opacity-50': Math.floor(currentIndex / itemsPerView) !== index
      }]" style="width: 12px; height: 12px; cursor: pointer; transition: all 0.3s;"
        @click="goToSlide(index * itemsPerView)">
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue';
import BookCard from '@/components/BookCard.vue';
import { useBookStore } from '@/Store/Book.store';
import { toRefs } from 'vue';

const props = defineProps({
  selectedAuthor: String,
  selectedGenre: String,
  selectedPublisher: String,
  selectedYear: String
});

const { selectedAuthor, selectedGenre, selectedPublisher, selectedYear } = toRefs(props);

const allBooks = ref([]);
const books = ref([]);
const currentIndex = ref(0);
const itemsPerView = ref(5);

const maxIndex = computed(() =>
  Math.max(0, books.value.length - itemsPerView.value)
);

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
  currentIndex.value = 0;
};

const nextSlide = () => {
  if (currentIndex.value < maxIndex.value) currentIndex.value++;
};

const prevSlide = () => {
  if (currentIndex.value > 0) currentIndex.value--;
};

const goToSlide = (index) => {
  currentIndex.value = Math.min(index, maxIndex.value);
};

const updateItemsPerView = () => {
  const width = window.innerWidth;
  if (width < 768) itemsPerView.value = 1;
  else if (width < 1024) itemsPerView.value = 2;
  else if (width < 1200) itemsPerView.value = 3;
  else if (width < 1400) itemsPerView.value = 4;
  else itemsPerView.value = 5;

  if (currentIndex.value > maxIndex.value) {
    currentIndex.value = maxIndex.value;
  }
};

watch([selectedAuthor, selectedGenre, selectedPublisher, selectedYear], filterBooks);

onMounted(async () => {
  updateItemsPerView();
  window.addEventListener('resize', updateItemsPerView);
  try {
    const bookStore = useBookStore();
    const res = await bookStore.fetchBooksHot();
    allBooks.value = Array.isArray(res) ? res : [];
    books.value = Array.isArray(res) ? res : [];
  } catch (error) {
    console.error('Lỗi khi lấy sách nổi bật:', error);
    books.value = [];
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateItemsPerView);
});
</script>

<style scoped>
.ratio img {
  object-fit: cover;
}

@media (min-width: 992px) {
  .col-lg-custom {
    flex: 0 0 auto;
    width: 20%;
  }
}
</style>
