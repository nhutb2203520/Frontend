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
              <p><strong>Tiêu đề:</strong> {{ book.title }}</p>
              <p><strong>Chuyên ngành:</strong> {{ book.category }}</p>
              <button class="btn btn-outline-primary mt-3" @click="borrowBook">Mượn sách</button>
            </div>
          </div>
  
          <div class="description-section border-top p-4 mt-3 bg-white">
            <h5 class="fw-bold">Mô tả sách</h5>
            <p>{{ book.description || 'Chưa có mô tả.' }}</p>
          </div>
        </div>
  
        <div v-else class="container text-center py-5 text-white">
          <h4>Không tìm thấy sách với ID: {{ $route.params.id }}</h4>
        </div>
  
        <Footer />
      </div>
    </div>
  </template>
  
  <script>
  import SideBar from '@/components/Client/SideBar.vue';
  import Footer from '@/components/Client/Footer.vue';
  
  export default {
    name: 'BookDetails',
    components: { SideBar, Footer },
    data() {
      return {
        sidebarOpen: true,
        book: null
      };
    },
    mounted() {
      const id = this.$route.params.id;
      console.log('ID từ URL:', id);
  
      const books = JSON.parse(localStorage.getItem('hotBooks')) || [];
      console.log('Danh sách trong localStorage:', books);
  
      const foundBook = books.find(b => b._id === id);
      console.log('Sách tìm được:', foundBook);
  
      if (foundBook) {
        this.book = foundBook;
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
    margin-left: 300px; /* Chiều rộng khi sidebar mở */
  }
  
  .main-content.collapsed {
    margin-left: 80px; /* Chiều rộng khi sidebar thu gọn */
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
  