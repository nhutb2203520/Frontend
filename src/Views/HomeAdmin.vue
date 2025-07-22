<template>
  <div class="dashboard-wrapper">
    <div class="background-overlay"></div>

    <div class="dashboard-content container">
      <h1 class="dashboard-title">Trang Tổng Quan</h1>

      <div class="row gy-5 justify-content-center">
        <div class="col-12 col-sm-6 col-lg-4 d-flex justify-content-center">
          <button class="btn-box w-100" @click="goTo('BorrowReturnManagement')">
            <i class="bi bi-journal-bookmark-fill me-2"></i>
            Quản lý mượn trả sách
          </button>
        </div>
        <div class="col-12 col-sm-6 col-lg-4 d-flex justify-content-center">
          <button class="btn-box w-100" @click="goTo('CategoryManagement')">
            <i class="bi bi-tags-fill me-2"></i>
            Quản lý loại sách
          </button>
        </div>
        <div class="col-12 col-sm-6 col-lg-4 d-flex justify-content-center">
          <button class="btn-box w-100" @click="goTo('ManagementReader')">
            <i class="bi bi-people-fill me-2"></i>
            Quản lý độc giả
          </button>
        </div>
        <div class="col-12 col-sm-6 col-lg-4 d-flex justify-content-center">
          <button class="btn-box w-100" @click="goTo('PublisherManager')">
            <i class="bi bi-buildings me-2"></i>
            Quản lý nhà xuất bản
          </button>
        </div>
        <div class="col-12 col-sm-6 col-lg-4 d-flex justify-content-center">
          <button class="btn-box w-100" @click="goTo('BookManagement')">
            <i class="bi bi-book-half me-2"></i>
            Quản lý sách
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboard',
  methods: {
    goTo(page) {
      const routes = {
        BorrowReturnManagement: '/admin/borrow-return-management',
        CategoryManagement: '/admin/category-management',
        ManagementReader: '/admin/management-reader',
        PublisherManager: '/admin/management-publisher',
        BookManagement: '/admin/book-management',
      };
      if (routes[page]) {
        this.$router.push(routes[page]);
      }
    },
  },
};
</script>

<style scoped>
/* === THAY ĐỔI CHÍNH Ở ĐÂY === */
.dashboard-wrapper {
  position: relative;
  /* Giảm padding trên và dưới */
  padding: 80px 20px 40px;
  /* Tăng padding top để có khoảng cách vừa phải với navbar */
  min-height: 100vh;
  background-image: url('@/assets/background_Admin.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  /* Thay đổi align-items để căn nội dung lên trên thay vì ở giữa */
  align-items: flex-start;
  justify-content: center;
}

/* Lớp phủ nền */
.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(10, 25, 47, 0.6), rgba(10, 25, 47, 0.6));
  z-index: 1;
}

/* Nội dung chính */
.dashboard-content {
  position: relative;
  z-index: 2;
  text-align: center;
  width: 100%;
  /* Đảm bảo content chiếm đủ không gian */
}

/* Tiêu đề chính */
.dashboard-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 50px;
  color: #ffffff;
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
  letter-spacing: 1px;
}

/* Các nút chức năng */
.btn-box {
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  color: #e0e0e0;
  font-size: 1.25rem;
  font-weight: 700;
  text-align: center;

  cursor: pointer;
  transition: all 0.3s ease;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 15px;
  min-height: 150px;
}

.btn-box i {
  font-size: 2.5rem;
  color: #63a4ff;
  transition: color 0.3s ease;
}

.btn-box:hover {
  transform: translateY(-8px);
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(99, 164, 255, 0.5);
  color: #63a4ff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.btn-box:hover i {
  color: #fff;
}

/* Responsive cho màn hình nhỏ */
@media (max-width: 768px) {
  .dashboard-wrapper {
    padding-top: 60px;
    /* Giảm padding top trên mobile */
  }

  .dashboard-title {
    font-size: 2.2rem;
  }

  .btn-box {
    font-size: 1rem;
    padding: 20px;
    flex-direction: row;
    gap: 10px;
    min-height: auto;
  }

  .btn-box i {
    font-size: 1.8rem;
  }
}
</style>