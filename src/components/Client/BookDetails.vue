<template>
  <div class="layout-wrapper py-4">
    <!-- Sidebar -->
    <SideBar @toggle="sidebarOpen = $event" @allBooks="handleAllBooks" @authorSelected="handleAuthor"
      @genreSelected="handleGenre" @publisherSelected="handlePublisher" @yearSelected="handleYear" />

    <!-- Main Content -->
    <div :class="['main-content', { collapsed: !sidebarOpen }]">
      <div>
        <div v-if="book" class="book-card shadow-lg rounded-4 p-4 text-light">
          <h4 class="text-info fw-bold text-center mb-4">📘 Thông tin chi tiết sách</h4>

          <div class="row">
            <!-- Hình ảnh sách -->
            <div class="col-md-5 d-flex justify-content-center align-items-center">
              <img :src="book.image" alt="Ảnh sách" class="book-image rounded" />
            </div>

            <!-- Thông tin sách -->
            <div class="col-md-7 mt-4 mt-md-0">
              <div class="book-info ps-2">
                <p><strong>Tên sách:</strong> {{ capitalizeWords(book.TenSach) }}</p>
                <p><strong>Loại sách:</strong> {{book.MaLoai?.map(loai => capitalizeWords(loai.TenLoai)).join(', ')}}
                </p>
                <p><strong>Tác giả:</strong> {{book.TacGia?.map(tg => capitalizeWords(tg.TenTG)).join(', ')}}</p>
                <p><strong>Năm xuất bản:</strong> {{ book.NamXuatBan }}</p>
                <p v-if="selectedCopy"><strong>Nhà xuất bản:</strong> {{ capitalizeWords(selectedCopy.MaNXB?.TenNXB) }}
                </p>
                <p><strong>Số lượt mượn:</strong> {{ book.SoLuotMuon }}</p>

                <!-- Nút hành động -->
                <div class="d-flex flex-wrap gap-3 mt-3">
                  <button class="btn btn-outline-info" @click="borrowBook">📚 Mượn sách</button>
                  <button v-if="selectedCopy" class="btn btn-outline-light" @click="showLocation = !showLocation">
                    {{ showLocation ? '🙈 Ẩn vị trí sách' : '📍 Xem vị trí sách' }}
                  </button>
                </div>

                <!-- Vị trí sách -->
                <div v-if="showLocation" class="mt-3 book-info">
                  <p><strong>Vị trí:</strong> {{ selectedCopy.MaViTri?.TenViTri || 'Không rõ' }}</p>
                  <p><strong>Mô tả:</strong> {{ selectedCopy.MaViTri?.MoTa || 'Không rõ' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Bảng bản sao sách -->
          <div class="mt-4">
            <h5 class="fw-bold text-white mb-2">📄 Danh sách bản sao sách</h5>
            <table class="table table-bordered table-dark table-striped rounded">
              <thead>
                <tr>
                  <th>Tên bản sao</th>
                  <th>Số lượng</th>
                  <th>Đã mượn</th>
                  <th>Còn lại</th>
                  <th>Chọn</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="copy in sachCopies" :key="copy._id">
                  <td>{{ copy.TenLoaiBanSao }}</td>
                  <td>{{ copy.SoQuyen }}</td>
                  <td>{{ copy.SoLuongDaMuon }}</td>
                  <td>
                    <span class="badge" :class="(copy.SoQuyen - copy.SoLuongDaMuon) > 0 ? 'bg-success' : 'bg-danger'">
                      {{ copy.SoQuyen - copy.SoLuongDaMuon }}
                    </span>
                  </td>
                  <td>
                    <input type="radio" :value="copy._id" name="sachCopy" v-model="selectedCopyId"
                      :disabled="(copy.SoQuyen - copy.SoLuongDaMuon) <= 0" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mô tả sách -->
          <div class="mt-4 p-3 bg-secondary-subtle rounded shadow-sm">
            <h5 class="fw-bold text-black mb-2">📝 Mô tả sách</h5>
            <p class="text-black">{{ book.MoTa || 'Chưa có mô tả.' }}</p>
          </div>
        </div>

        <!-- Không tìm thấy sách -->
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
import { capitalizeWords } from '@/utils/stringUtils';
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
      book: null,
      sachCopies: [],
      selectedCopyId: null,
    };
  },
  async mounted() {
    const MaSach = this.$route.params.MaSach;
    try {
      const bookStore = useBookStore();
      const response = await bookStore.fetchBookByMaSach(MaSach);
      this.book = response.sach;
      this.sachCopies = response.sachCopies
    } catch (err) {
      console.error('Lỗi khi lấy thông tin sách:', err);
      this.book = null;
    }
  }, computed: {
    selectedCopy() {
      return this.sachCopies.find(copy => copy._id === this.selectedCopyId) || null;
    }
  },
  methods: {
    capitalizeWords,
    handleAuthor(author) {
      const store = useSearchFilterStore();
      store.setAuthor(author);
      this.$router.replace('/catalogbook');
    },
    handleGenre(genre) {
      const store = useSearchFilterStore();
      store.setGenre(genre);
      this.$router.replace('/catalogbook');
    },
    handlePublisher(publisher) {
      const store = useSearchFilterStore();
      store.setPublisher(publisher);
      this.$router.replace('/catalogbook');
    },
    handleYear(year) {
      const store = useSearchFilterStore();
      store.setYear(year);
      this.$router.replace('/catalogbook');
    },
    handleAllBooks() {
      const store = useSearchFilterStore();
      store.clearAll();
      this.$router.replace('/catalogbook');
    },
    async borrowBook() {
      if (!this.selectedCopyId) {
        ElMessage.warning('Vui lòng chọn một bản sao sách để mượn!');
        return;
      }
      const borrowStore = useBorrowBookStore();
      try {
        const res = await borrowStore.registerBorrowBook(this.selectedCopyId);
        if (res.message === 'Tạo phiếu mượn thành công.') {
          ElMessage.success('Đăng ký mượn sách thành công.');
          this.$router.push({ name: 'BorrowingHistory' });
        } else {
          ElMessage.error(res.message || 'Lỗi mượn sách.');
        }
      } catch (err) {
        ElMessage.error(err?.message || 'Đã xảy ra lỗi');
      }
    },
  },
};
</script>

<style scoped>
.layout-wrapper {
  display: flex;
  min-height: 100vh;
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

.badge {
  font-size: 0.9rem;
  padding: 5px 10px;
}
</style>
