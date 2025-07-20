<template>
  <div class="container-fluid bg-dark text-white py-5">
    <!-- Tiêu đề -->
    <div class="text-center mb-5">
      <h2 class="text-warning fw-bold display-5">SÁCH YÊU THÍCH</h2>
      <div class="d-flex justify-content-center align-items-center gap-3">
        <div class="bg-warning" style="width: 80px; height: 2px;"></div>
        <div class="fs-3">❤️</div>
        <div class="bg-warning" style="width: 80px; height: 2px;"></div>
      </div>
    </div>

    <!-- Bộ lọc theo ngày -->
    <div class="mb-4 me-3 text-end =">
      <select class="form-select w-auto d-inline-block bg-dark text-white border-warning" v-model="sortOrder"
        @change="sortBooks">
        <option value="desc">Mới nhất</option>
        <option value="asc">Cũ nhất</option>
      </select>
    </div>

    <!-- Danh sách sách -->
    <div class="row g-4">
      <div class="col-1-5" v-for="(book, index) in books" :key="index">
        <router-link :to="`/book/${book.MaSach?.MaSach}`" data-aos="fade-up" data-aos-duration="1000"
          class=" text-decoration-none book-card bg-dark bg-opacity-75 border border-light rounded-3 p-3 h-100 d-flex flex-column align-items-center text-center book-hover">
          <div class="ratio ratio-4x3 mb-3 rounded overflow-hidden w-100">
            <img :src="'http://localhost:3000' + book.MaSach.image[0]" :alt="book.MaSach.TenSach"
              class="img-fluid rounded" />
          </div>
          <h5 class="text-white fw-semibold mb-3" style="min-height: 48px">
            {{ book.MaSach?.TenSach }}
          </h5>
          <p class="text-light fst-italic mb-1">{{book.MaSach.TacGia.map(tg => tg.TenTG).join(', ')}}</p>
          <small class="text-secondary fst-italic">Ngày thêm: {{ formatDate(book.NgayThem) }}</small>
        </router-link>
      </div>
    </div>

    <p v-if="books.length === 0" class="text-danger text-center fw-bold fs-5 mt-4">
      Bạn chưa có sách yêu thích nào.
    </p>

    <!-- Nút xem thêm -->
    <div class="text-center mt-4" v-if="displayCount < allBooks.length">
      <button class="btn btn-outline-warning" @click="loadMore">Xem thêm</button>
    </div>
  </div>
  <Footer />

</template>

<script>
import Footer from '@/components/Client/Footer.vue'
import { useBookStore } from '@/Store/Book.store'
import { formatDate } from '@/utils/formatDate'
export default {
  name: 'FavoriteBookList',
  data() {
    return {
      allBooks: [],
      books: [],
      sortOrder: 'desc',
      displayCount: 10
    };
  },
  components: {
    Footer
  },
  methods: {
    formatDate,
    async loadFavoriteBooks() {
      const data = await useBookStore().getAllBookFavorite()
      this.allBooks = Array.isArray(data) ? data : []
      this.sortBooks();
    },
    sortBooks() {
      if (this.allBooks.length > 0) {
        this.allBooks = this.allBooks.filter(book => book.NgayThem);
        this.allBooks.sort((a, b) => {
          const timeA = new Date(a.createdAt).getTime();
          const timeB = new Date(b.createdAt).getTime();

          return this.sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
        });

        this.books = this.allBooks.slice(0, this.displayCount);
      }
    }
    ,
    loadMore() {
      this.displayCount += 10;
      this.books = this.allBooks.slice(0, this.displayCount);
    },
  },
  mounted() {
    this.loadFavoriteBooks();
  }
};
</script>

<style scoped>
.form-select:hover {
  cursor: pointer;
}

.col-1-5 {
  width: 20%;
}

@media (max-width: 1200px) {
  .col-1-5 {
    width: 25%;
  }
}

@media (max-width: 992px) {
  .col-1-5 {
    width: 33.33%;
  }
}

@media (max-width: 768px) {
  .col-1-5 {
    width: 50%;
  }
}

@media (max-width: 576px) {
  .col-1-5 {
    width: 100%;
  }
}

.book-hover {
  transition: transform 0.3s, box-shadow 0.3s;
}

.book-hover:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 24px rgba(0, 212, 255, 0.3);
  border-color: #00d4ff;
}

.ratio img {
  object-fit: cover;
}
</style>
