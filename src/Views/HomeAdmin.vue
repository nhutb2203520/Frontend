<template>
    <div>
      <!-- Navbar -->
      <NavBarAD />
  
      <!-- Dashboard -->
      <div class="dashboard-container">
        <button class="title">Trang tổng quan</button>
  
        <div class="container">
          <div class="row gy-5 justify-content-center">
            <!-- 3 nút hàng đầu -->
            <div class="col-12 col-sm-6 col-lg-4 d-flex justify-content-center">
              <button class="btn-box w-100" @click="goTo('BorrowReturnManagement')">Quản lý thông tin mượn trả sách</button>
            </div>
            <div class="col-12 col-sm-6 col-lg-4 d-flex justify-content-center">
              <button class="btn-box w-100" @click="goTo('CategoryManagement')">Quản lý loại sách</button>
            </div>
            <div class="col-12 col-sm-6 col-lg-4 d-flex justify-content-center">
              <button class="btn-box w-100" @click="goTo('ManagementReader')">Quản lý độc giả</button>
            </div>
  
            <!-- 2 nút hàng sau -->
            <div class="col-12 col-sm-6 col-lg-4 d-flex justify-content-center">
              <button class="btn-box w-100" @click="goTo('PublisherManager')">Quản lý nhà xuất bản</button>
            </div>
            <div class="col-12 col-sm-6 col-lg-4 d-flex justify-content-center">
              <button class="btn-box w-100" @click="goTo('BookManagement')">Quản lý sách</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import NavBarAD from '@/components/Admin/NavBarAD.vue';
  
  export default {
    name: 'AdminDashboard',
    components: { NavBarAD },
    methods: {
      goTo(page) {
        const routes = {
          borrow: '/admin/borrow',
          genre: '/admin/genres',
          ManagementReader: '/admin/management-reader',
          publisher: '/admin/publishers',
          book: '/admin/books',
          CategoryManagement: '/admin/category-management',
          PublisherManager: '/admin/management-publisher',
          BookManagement: '/admin/book-management',
          BorrowReturnManagement: '/admin/borrow-return-management',
        };
        this.$router.push(routes[page]);
      },
    },
  };
  </script>
  
  <style scoped>
  .dashboard-container {
    padding: 40px 20px;
    text-align: center;
    min-height: 100vh;
    background-image: url('@/assets/background_Admin.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    background-attachment: fixed;
  }
  
  .title {
    font-size: 30px;
    font-style: italic;
    margin-bottom: 40px;
    color: #ffffff;
    background-color: rgb(54, 54, 146);
    border: 2px solid #fff;
    padding: 10px 20px;
    border-radius: 10px;
  }
  
  .btn-box {
    padding: 20px 30px;
    border: 2px solid #000;
    border-radius: 10px;
    background-color: rgba(114, 150, 203, 0.85);
    font-style: italic;
    font-size: 24px;
    cursor: pointer;
    transition: 0.3s ease;
    min-width: 220px;
    max-width: 100%;
  }
  
  .btn-box:hover {
    background-color: rgba(26, 55, 80, 0.95);
    transform: scale(1.05);
    color: #fff;
  }
  </style>
  