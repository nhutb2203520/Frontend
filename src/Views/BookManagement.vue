<template>
  <div class="overlay">
    <!-- Sidebar bên trái -->
    <SideBarAD @toggle="handleSidebarToggle" />

    <router-view />

    <!-- Nội dung quản lý -->
    <div v-if="route.name === 'BookManagement'" class="book-management">
      <h1 class="title">Quản lý sách</h1>

      <!-- Thanh công cụ đầu -->
      <div class="top-bar">
        <button class="total-btn">Tổng số sách: {{ totalBooks }}</button>
        <div class="group-actions">
          <button class="action-btn" @click="goToManageLocation">Quản lý vị trí sách</button>
          <button class="action-btn" @click="goToManageAuthor">Quản lý tác giả</button>
        </div>
      </div>

      <!-- Tìm kiếm và thêm -->
      <div class="actions">
        <input type="text" v-model="searchKeyword" placeholder="Tìm kiếm theo tên sách..." />
        <button class="add-btn" @click="goToAddBook">Thêm sách</button>
      </div>

      <!-- Danh sách sách -->
      <div class="book-list">
        <h3>Danh sách sách</h3>
        <div class="scrollable-list">
          <ul>
            <li v-for="book in filteredBooks" :key="book.MaSach" @click="toggleBook(book)" class="book-item">
              <strong>{{ capitalizeWords(book.TenSach) }}</strong>

              <div v-if="selectedBook?.MaSach === book.MaSach" class="book-detail">
                <p><strong>Mã sách:</strong> {{ book.MaSach }}</p>
                <p><strong>Tên sách:</strong> {{ capitalizeWords(book.TenSach) }}</p>
                <p><strong>Tác giả:</strong> {{book.TacGia.map(tg => capitalizeWords(tg.TenTG)).join(', ')}}</p>
                <p><strong>Năm xuất bản:</strong> {{ book.NamXuatBan }}</p>

                <div class="detail-actions">
                  <button class="btn btn-warning" @click.stop="editBook(book)">✏️ Chỉnh sửa</button>
                  <button class="btn btn-danger" @click.stop="deleteBook(book)">🗑️ Xóa</button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SideBarAD from '@/components/Admin/SideBarAD.vue';
import { useBookStore } from '@/Store/Book.store';
import { capitalizeWords } from '@/utils/stringUtils'
import { ElMessage, ElMessageBox } from 'element-plus';

const router = useRouter();
const route = useRoute();

const bookStore = useBookStore()
const sidebarOpen = ref(true);
const searchKeyword = ref('');
const selectedBook = ref(null);
const books = ref([]);

onMounted(async () => {
  const res = await bookStore.fetchBooks()
  books.value = Array.isArray(res.danhsachsach) ? res.danhsachsach : []
})
watch(() => route.name, async (newRoute) => {
  if (newRoute === 'BookManagement') {
    const res = await bookStore.fetchBooks()
    books.value = Array.isArray(res.danhsachsach) ? res.danhsachsach : []
  }
}, { immediate: true })
const totalBooks = computed(() => books.value.length || 0);
const filteredBooks = computed(() => {
  selectedBook.value = null
  return books.value.filter((book) =>
    book.TenSach.toLowerCase().includes(searchKeyword.value.toLowerCase())
  );
});

function handleSidebarToggle(isOpen) {
  sidebarOpen.value = isOpen;
}

function goToAddBook() {
  selectedBook.value = null
  router.push({ name: 'AddBook' });
}

function goToManageLocation() {
  selectedBook.value = null
  router.push({ name: 'LocationManagement' });
}

function goToManageAuthor() {
  selectedBook.value = null
  router.push({ name: 'AuthorManagement' });
}

function toggleBook(book) {
  selectedBook.value = selectedBook.value?.MaSach === book.MaSach ? null : book;
}

function editBook(book) {
  router.push({ name: 'EditBook', params: { id: book.MaSach } });
}

async function deleteBook(book) {
  await ElMessageBox.confirm(
    `Bạn có chắc chắn muốn xóa quyển sách "${book.TenSach}"?`,
    'Xác nhận xóa sách',
    {
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy',
      type: 'warning',
      confirmButtonClass: 'el-button--danger'
    }
  )
  try {
    const res = await bookStore.deleteOneBook(book.MaSach)
    if (res.message === 'Xóa sách thành công.') {
      ElMessage.success(`Xóa sách tên ${book.TenSach} và tất cả các bản sao thành công.`)
      const fetch = await bookStore.fetchBooks()
      selectedBook.value = null
      books.value = Array.isArray(fetch.danhsachsach) ? fetch.danhsachsach : []
    } else {
      ElMessage.error(res.message || 'Xóa sách thất bại.')
    }
  } catch (err) {
    ElMessage.error('Lỗi trong quá trình xóa sách.')
  }
}
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
  margin-top: 12px !important;
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