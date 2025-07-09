<template>
  
  <div class="overlay">
    <!-- NavBar trên cùng -->
    <NavBarAD />
    <!-- Sidebar bên trái -->
    <SideBarAD @toggle="handleSidebarToggle" />
  
    <router-view />
    <!-- Nội dung quản lý -->
    <div v-if ="route.name ==='BookManagement'" class="book-management">
    
      <h1 class="title" >Quản lý sách</h1>
     
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
        <div class="scrollable-list">
          <ul>
            <li
              v-for="book in filteredBooks"
              :key="book.id"
              @click="toggleBook(book)"
              class="book-item"
            >
              <strong>{{ book.name }}</strong>

              <div v-if="selectedBook?.id === book.id" class="book-detail">
                <p><strong>ID:</strong> {{ book.id }}</p>
                <p><strong>Tên sách:</strong> {{ book.name }}</p>
                <div class="detail-actions">
                  <button class="btn btn-warning" @click.stop="editBook(book)">
                    ✏️ Chỉnh sửa
                  </button>
                  <button class="btn btn-danger" @click.stop="deleteBook(book)">
                    🗑️ Xóa
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBarAD from "@/components/Admin/NavBarAD.vue";
import SideBarAD from "@/components/Admin/SideBarAD.vue";
import AddBook from "@/components/Admin/AddBook.vue";
import EditBook from "@/components/Admin/EditBook.vue";
import LocationManagement from "@/components/Admin/LocationManagement.vue";
export default {
  name: "BookManagement",
  components: {
    NavBarAD,
    SideBarAD,
    AddBook,
    EditBook,
    LocationManagement,
  },
  data() {
    return {
      sidebarOpen: true,
      searchKeyword: "",
      selectedBook: null,
      books: [
        { id: 1, name: "Lập trình Python cơ bản" },
        { id: 2, name: "Tâm lý học hiện đại" },
        { id: 3, name: "Dữ liệu lớn và AI" },
        { id: 4, name: "Thiết kế phần mềm hướng đối tượng" },
        { id: 5, name: "Trí tuệ nhân tạo ứng dụng" },
        
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
    route() {
      return this.$route;
    },
  },
  methods: {
    handleSidebarToggle(isOpen) {
      this.sidebarOpen = isOpen;
    },
    goToAddBook() {
      this.$router.push({
        name: "AddBook",
      });
    },
    goToManageLocation() {
      this.$router.push({
      name: "LocationManagement",  
    });
    },
    goToManageAuthor() {
      this.$router.push({
        name: "AuthorManagement",
      });
    },
    toggleBook(book) {
      this.selectedBook = this.selectedBook?.id === book.id ? null : book;
    },
    editBook(book) {
      this.$router.push({
    name: "EditBook",
    params: { id: book.id }
      });
    },
    deleteBook(book) {
      if (confirm(`Bạn có chắc chắn muốn xóa sách "${book.name}" không?`)) {
        this.books = this.books.filter((b) => b.id !== book.id);
        this.selectedBook = null;
      }
    },
  },
};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 10px;
  width: 100vw;
  height: 100vh;
  background: rgba(20, 20, 20, 0.85);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 120px 20px 20px;
  overflow-y: auto;
  z-index: 1;
}

.book-management {
  margin-top: 12  px !important;
  width: 65%;
  max-width: 65%;
  background: #fff;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  font-family: 'Segoe UI', sans-serif;
  z-index: 1;
  position: relative;
}

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
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #ccc;
  max-height: 400px;
  overflow-y: auto;
}

.book-list h3 {
  margin-bottom: 15px;
  color: #34495e;
}

.book-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.book-item {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
}

.book-detail {
  background-color: #fff;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-top: 10px;
}

.detail-actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 14px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  border: none;
}

.btn-warning {
  background-color: #f1c40f;
  color: #000;
}

.btn-danger {
  background-color: #e74c3c;
  color: #fff;
}
</style>
