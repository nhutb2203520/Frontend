<template>
  <div class="layout-wrapper">
    <SideBar @toggle="sidebarOpen = $event" />
    <div :class="['main-content', { 'collapsed': !sidebarOpen }]">
      <div class="container book-details text-dark" v-if="book">
        <div class="row upper-section mt-4">
          <div class="col-md-6 image-section d-flex justify-content-center align-items-center border">
            <img :src="book.image" alt="Ảnh sách" class="book-image" />
          </div>
          <div class="col-md-6 detail-section border p-4 bg-light">
            <h4 class="mb-3 text-primary fw-semibold">Thông tin chi tiết sách</h4>
            <p><strong>Tên sách:</strong> {{ book.TenSach }}</p>
            <p><strong>Loại sách:</strong> {{ book.MaLoai?.TenLoai }}</p>
            <p><strong>Số quyển trong kho:</strong> {{ book.SoQuyen - book.SoLuongDaMuon }}</p>
            <p><strong>Tác giả:</strong> {{book.TacGia?.map(tg => tg.TenTG).join(', ')}}</p>
            <p><strong>Nhà xuất bản:</strong> {{ book.MaNXB?.TenNXB }}</p>
            <p><strong>Số lượt mượn:</strong> {{ book.SoLuotMuon }}</p>
            <div class="d-flex gap-2 mt-3">
              <button class="btn btn-primary" @click="borrowBook">
                📚 Mượn sách
              </button>
              <button class="btn btn-info text-white" @click="showLocation = !showLocation">
                {{ showLocation ? '🙈 Ẩn vị trí sách' : '📍 Xem vị trí sách' }}
              </button>
            </div>


            <div v-if="showLocation" class="mt-3">
              <p>
                <strong>Vị trí:</strong> {{ book.MaViTri?.TenViTri || 'Không rõ' }}
              </p>
              <p>
                <strong>Mô tả:</strong> {{ book.MaViTri?.MoTa || 'Không rõ' }}
              </p>
            </div>
          </div>
        </div>

        <div class="description-section border-top p-4 mt-3 bg-white">
          <h5 class="fw-bold">Mô tả sách</h5>
          <p>{{ book.MoTa || 'Chưa có mô tả.' }}</p>
        </div>
      </div>

      <div v-else class="container text-center py-5 text-white">
        <h4>Không tìm thấy sách với mã: {{ $route.params.MaSach }}</h4>
      </div>

      <Footer />
    </div>
  </div>
</template>

<script>
import SideBar from '@/components/Client/SideBar.vue';
import Footer from '@/components/Client/Footer.vue';
import { useBookStore } from '@/Store/Book.store';

export default {
  name: 'BookDetails',
  components: { SideBar, Footer },
  data() {
    return {
      sidebarOpen: true,
      showLocation: false, // Biến để điều khiển hiển thị vị trí sách
      book: null
    };
  },
  async mounted() {
    const MaSach = this.$route.params.MaSach;
    try {
      const bookStore = useBookStore();
      const response = await bookStore.fetchBookByMaSach(MaSach);
      this.book = response;
      console.log('Thông tin sách:', this.book);
    } catch (err) {
      console.error('Lỗi khi lấy thông tin sách:', err);
      this.book = null; // Nếu có lỗi, đặt book là null
    }
  },
  methods: {
    borrowBook() {
      alert('Bạn đã chọn mượn sách: ' + this.book.title);
    }
  }
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
  padding: 0;
  margin-left: 300px;
  /* Chiều rộng khi sidebar mở */
}

.main-content.collapsed {
  margin-left: 80px;
  /* Chiều rộng khi sidebar thu gọn */
}

.book-details {
  margin-top: 20px;
}

.image-section {
  min-height: 300px;
}

.book-image {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
}

.detail-section {
  background-color: #fdfdfd;
}

.description-section {
  background-color: #fff;
}
</style>
