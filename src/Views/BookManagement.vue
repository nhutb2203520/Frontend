<template>
  <div class="home-wrapper position-relative min-vh-100 bg-light">
    <!-- Sidebar Admin -->
    <SideBarAD @toggle="handleSidebarToggle" />

    <!-- Nội dung chính -->
    <div
      class="main-content p-3 p-md-4"
      :class="{
        'content-shifted': sidebarOpen,
        'content-expanded': !sidebarOpen,
      }"
    >
      <NavBarAD />
      <!-- Tiêu đề -->
      <h1 class="title">Quản lý sách</h1>

      <!-- Thanh công cụ đầu -->
      <div class="top-bar">
        <button class="total-btn">Tổng số sách: {{ totalBooks }}</button>
        <div class="group-actions">
          <button class="action-btn" @click="goToManageLocation">
            Quản lý vị trí sách
          </button>
          <button class="action-btn" @click="goToManageAuthor">
            Quản lý tác giả
          </button>
        </div>
      </div>

      <!-- Tìm kiếm và thêm -->
      <div class="actions">
        <input
          type="text"
          v-model="searchKeyword"
          placeholder="Tìm kiếm theo tên sách..."
        />
        <button class="add-btn" @click="goToAddBook">Thêm sách</button>
      </div>

      <!-- Danh sách sách -->
      <div class="book-list">
        <h3>Danh sách sách</h3>
        <ul>
          <li v-for="book in filteredBooks" :key="book.id">
            {{ book.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import NavBarAD from "@/components/Admin/NavBarAD.vue";
import SideBarAD from "@/components/Admin/SideBarAD.vue";

export default {
  name: "BookManagement",
  components: {
    NavBarAD,
    SideBarAD,
  },
  data() {
    return {
      sidebarOpen: true,
      searchKeyword: "",
      books: [
        { id: 1, name: "Lập trình Python cơ bản" },
        { id: 2, name: "Tâm lý học hiện đại" },
        { id: 3, name: "Dữ liệu lớn và AI" },
      ],
    };
  },
  computed: {
    totalBooks() {
      return this.books.length;
    },
    filteredBooks() {
      return this.books.filter((book) =>
        book.name.toLowerCase().includes(this.searchKeyword.toLowerCase())
      );
    },
  },
  methods: {
    handleSidebarToggle(isOpen) {
      this.sidebarOpen = isOpen;
    },
    goToAddBook() {
      this.$router.push("/admin/add-book");
    },
    goToManageLocation() {
      this.$router.push("/admin/manage-location");
    },
    goToManageAuthor() {
      this.$router.push("/admin/manage-author");
    },
  },
};
</script>

<style scoped>
/* Hiệu ứng dịch chuyển nội dung */
.main-content {
  transition: margin-left 0.3s ease;
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

.content-shifted {
  margin-left: 250px; /* khi sidebar mở */
}

.content-expanded {
  margin-left: 80px; /* khi sidebar thu gọn */
}

/* Responsive xử lý khi màn nhỏ */
@media (max-width: 768px) {
  .content-shifted,
  .content-expanded {
    margin-left: 0 !important;
  }
}

/* Các thành phần giao diện */
.title {
  text-align: center;
  font-size: 28px;
  margin-bottom: 25px;
  color: #2c3e50;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
  margin-bottom: 20px;
}

.total-btn {
  background-color: #f1f1f1;
  color: #333;
  border: 1px solid #ccc;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: bold;
}

.group-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 12px 16px;
  border: 2px solid #27ae60;
  background-color: white;
  color: #27ae60;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.action-btn:hover {
  background-color: #27ae60;
  color: white;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  flex-wrap: wrap;
  gap: 10px;
}

.actions input {
  flex: 1;
  min-width: 250px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 15px;
}

.add-btn {
  padding: 12px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.add-btn:hover {
  background-color: #2980b9;
}

.book-list {
  background: #f8f8f8;
  padding: 25px;
  border-radius: 10px;
  border: 1px solid #ccc;
}

.book-list h3 {
  margin-bottom: 15px;
  color: #34495e;
}

.book-list ul {
  list-style: none;
  padding: 0;
}

.book-list li {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}
</style>
