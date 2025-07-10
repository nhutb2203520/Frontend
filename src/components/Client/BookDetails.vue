<template>
  <div class="layout-wrapper py-4">
    <!-- Lỗi chỗ slidebar khi nhấn vào option con -->
    <SideBar @toggle="sidebarOpen = $event" @authorSelected="handleAuthor" @genreSelected="handleGenre"
      @publisherSelected="handlePublisher" @yearSelected="handleYear" @allBooks="handleAllBooks" />
    <div :class="['main-content', { 'collapsed': !sidebarOpen }]">
      <div class="">
        <div v-if="book" class="book-card shadow-lg rounded-4 p-4 text-light">
          <h4 class="text-info fw-bold text-center mb-4">📘 Thông tin chi tiết sách</h4>

          <div class="row">
            <!-- Hình ảnh -->
            <div class="col-md-5 d-flex justify-content-center align-items-center">
              <img :src="book.image" alt="Ảnh sách" class="book-image rounded" />
            </div>

            <!-- Thông tin chi tiết -->
            <div class="col-md-7 mt-4 mt-md-0">
              <div class="book-info ps-2">
                <p><strong>Tên sách:</strong> {{ capitalizeWords(book.TenSach) }}</p>
                <p><strong>Loại sách:</strong> {{ capitalizeWords(book.MaLoai?.TenLoai) }}</p>
                <p><strong>Số quyển trong kho:</strong> {{ book.SoQuyen - book.SoLuongDaMuon }}</p>
                <p><strong>Tác giả:</strong> {{book.TacGia?.map(tg => capitalizeWords(tg.TenTG)).join(', ')}}</p>
                <p><strong>Nhà xuất bản:</strong> {{ capitalizeWords(book.MaNXB?.TenNXB) }}</p>
                <p><strong>Số lượt mượn:</strong> {{ book.SoLuotMuon }}</p>

                <!-- Nút hành động -->
                <div class="d-flex flex-wrap gap-3 mt-3">
                  <button class="btn btn-outline-info" @click="borrowBook">📚 Mượn sách</button>
                  <button class="btn btn-outline-light" @click="showLocation = !showLocation">
                    {{ showLocation ? '🙈 Ẩn vị trí sách' : '📍 Xem vị trí sách' }}
                  </button>
                </div>

                <!-- Vị trí sách -->
                <div v-if="showLocation" class="mt-3 book-info">
                  <p><strong>Vị trí:</strong> {{ book.MaViTri?.TenViTri || 'Không rõ' }}</p>
                  <p><strong>Mô tả:</strong> {{ book.MaViTri?.MoTa || 'Không rõ' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Mô tả sách -->
          <div class="mt-4 p-3 bg-secondary-subtle rounded shadow-sm">
            <h5 class="fw-bold text-black mb-2">📝 Mô tả sách</h5>
            <p class="text-black">{{ book.MoTa || 'Chưa có mô tả.' }}</p>
          </div>
        </div>

        <!-- Khi không tìm thấy -->
        <div v-else class="text-center text-danger py-5">
          <h4>Không tìm thấy sách với mã: {{ $route.params.MaSach }}</h4>
        </div>
      </div>

      <Footer />
    </div>
  </div>
</template>

<script>
import SideBar from '@/components/Client/SideBar.vue';
import Footer from '@/components/Client/Footer.vue';
import { useBookStore } from '@/Store/Book.store';
import { capitalizeWords } from '@/utils/stringUtils'
import { useSearchFilterStore } from '@/Store/SearchFilter.store';
import { useBorrowBookStore } from '@/Store/BorrowBook.store';
import { ElMessage } from 'element-plus';
export default {
  name: 'BookDetails',
  components: { SideBar, Footer },
  data() {
    return {
      sidebarOpen: true,
      showLocation: false,
      book: null
    };
  },
  async mounted() {
    const MaSach = this.$route.params.MaSach;
    try {
      const bookStore = useBookStore();
      const response = await bookStore.fetchBookByMaSach(MaSach);
      this.book = response;
    } catch (err) {
      console.error('Lỗi khi lấy thông tin sách:', err);
      this.book = null;
    }
  }, methods: {
    capitalizeWords,
    handleAuthor(author) {
      const store = useSearchFilterStore();
      store.setAuthor(author);
      this.$router.push('/catalogbook');
    },
    handleGenre(genre) {
      const store = useSearchFilterStore();
      store.setGenre(genre);
      this.$router.push('/catalogbook');
    },
    handlePublisher(publisher) {
      const store = useSearchFilterStore();
      store.setPublisher(publisher);
      this.$router.push('/catalogbook');
    },
    handleYear(year) {
      const store = useSearchFilterStore();
      store.setYear(year);
      this.$router.push('/catalogbook');
    },
    handleAllBooks() {
      const store = useSearchFilterStore();
      store.clearAll();
      this.$router.push('/catalogbook');
    },
    async borrowBook() {
      const borrowStore = useBorrowBookStore()
      try {
        const res = await borrowStore.registerBorrowBook(this.book._id)
        if (res.message === 'Tạo phiếu mượn thành công.') {
          ElMessage.success('Đăng ký mượn sách thành công.')
          this.$router.push({ name: 'BorrowingHistory' })
        } else {
          ElMessage.error(res.message || 'lỗi')
        }
      } catch (err) {
        ElMessage.error(err?.message || 'Đã xảy ra lỗi');

      }
    }
  }
}
</script>

<style scoped>
.layout-wrapper {
  display: flex;
  min-height: 100vh;
  /* Tông nền tối */
}

.main-content {
  flex-grow: 1;
  transition: margin-left 0.3s ease;
  margin-left: 300px;
  color: #fff;
}

.main-content.collapsed {
  margin-left: 80px;
}

.book-card {
  background-color: #2b2b3d;
  border-radius: 0px !important;
  padding: 30px;
}

.book-image {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
  border: 1px solid #444;
  padding: 10px;
  background-color: #3a3a4d;
}

.book-info p {
  margin-bottom: 10px;
  font-size: 1rem;
}
</style>
