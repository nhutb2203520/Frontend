<template>
  <div class="container-fluid bg-dark text-white py-5">
    <div class="text-center mb-5">
      <h2 class="text-warning fw-bold display-5">SÁCH YÊU THÍCH</h2>
      <div class="d-flex justify-content-center align-items-center gap-3">
        <div class="bg-warning" style="width: 80px; height: 2px;"></div>
        <div class="fs-3">❤️</div>
        <div class="bg-warning" style="width: 80px; height: 2px;"></div>
      </div>
    </div>

    <!-- Bộ lọc theo ngày -->
    <div class="mb-4 text-end">
      <select class="form-select w-auto d-inline-block bg-dark text-white border-warning"
              v-model="sortOrder" @change="sortBooks">
        <option value="desc">Mới nhất</option>
        <option value="asc">Cũ nhất</option>
      </select>
    </div>

    <!-- Danh sách sách -->
    <div class="row g-4">
      <div class="col-12 col-sm-6 col-md-4 col-lg-3"
           v-for="(book, index) in books" :key="index">
        <div
          class="book-card bg-dark bg-opacity-75 border border-light rounded-3 p-3 h-100 d-flex flex-column align-items-center text-center book-hover"
        >
          <div class="ratio ratio-4x3 mb-3 rounded overflow-hidden w-100">
            <img :src="book.image" :alt="book.title" class="img-fluid rounded" />
          </div>
          <h5 class="text-white fw-semibold mb-3" style="min-height: 48px">
            {{ book.title }}
          </h5>
          <p class="text-light fst-italic mb-1">{{ book.author }}</p>
          <small class="text-secondary fst-italic">Ngày thêm: {{ formatDate(book.dateAdded) }}</small>
        </div>
      </div>
    </div>

    <p v-if="books.length === 0" class="text-danger text-center fw-bold fs-5 mt-4">
      Bạn chưa có sách yêu thích nào.
    </p>
  </div>
</template>

<script>
export default {
  name: 'FavoriteBookList',
  data() {
    return {
      books: [],
      sortOrder: 'desc'
    };
  },
  methods: {
    loadFavoriteBooks() {
      this.books = [
        {
          id: 1,
          title: 'Nhà giả kim',
          author: 'Paulo Coelho',
          image: 'https://upload.wikimedia.org/wikipedia/vi/f/fb/Nh%C3%A0_gi%E1%BA%A3_kim.jpg',
          dateAdded: '2023-07-01'
        },
        {
          id: 2,
          title: 'Không gia đình',
          author: 'Hector Malot',
          image: 'https://salt.tikicdn.com/cache/750x750/ts/product/98/8c/b0/bdb38564c2c3a7f97ef772160f8481c3.jpg',
          dateAdded: '2023-06-25'
        },
        {
          id: 3,
          title: 'Totto-chan',
          author: 'Tetsuko Kuroyanagi',
          image: 'https://cdn0.fahasa.com/media/catalog/product/8/9/8934974130580.jpg',
          dateAdded: '2023-05-15'
        },
        {
          id: 4,
          title: 'Đắc nhân tâm',
          author: 'Dale Carnegie',
          image: 'https://upload.wikimedia.org/wikipedia/vi/0/06/%C4%90%E1%BA%AFc_nh%C3%A2n_t%C3%A2m.jpg',
          dateAdded: '2023-07-10'
        },
        {
          id: 5,
          title: 'Doraemon',
          author: 'Fujiko F. Fujio',
          image: 'https://product.hstatic.net/1000288293/product/8935244817313_01_efb75ddcb2154978ac253785ac237889_master.jpg',
          dateAdded: '2023-06-01'
        },
        {
          id: 6,
          title: 'Harry Potter',
          author: 'J.K. Rowling',
          image: 'https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509.jpg',
          dateAdded: '2023-06-28'
        }
      ];

      this.sortBooks();
    },
    sortBooks() {
      this.books.sort((a, b) => {
        const da = new Date(a.dateAdded);
        const db = new Date(b.dateAdded);
        return this.sortOrder === 'asc' ? da - db : db - da;
      });
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('vi-VN');
    }
  },
  mounted() {
    this.loadFavoriteBooks();
  }
};
</script>

<style scoped>
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
