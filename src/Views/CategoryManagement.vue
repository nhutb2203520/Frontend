<template>
  <div class="overlay d-flex">
    <SideBarAD />
    <div class="flex-grow-1">
      <NavBarAD />

      <div class="container-fluid px-3">
        <div class="publisher-management mx-auto mt-4">
          <h1 class="title">Quản lý loại sách</h1>

          <div class="top-bar d-flex flex-wrap justify-content-between gap-3 mb-4">
            <button class="total-btn">Tổng loại sách: {{ totalCategories }}</button>
            <div class="search" v-if="!showAddForm">
              <input v-model="searchKeyword" placeholder="Tìm kiếm theo tên loại sách..." />
            </div>
            <button class="add-btn" @click="toggleAddForm">
              {{ showAddForm ? '❌ Hủy thêm' : '➕ Thêm loại sách' }}
            </button>
          </div>

          <div class="reader-list">
            <h3>Danh sách loại sách</h3>

            <div v-if="showAddForm" class="add-form" @keyup.enter="addCategory">
              <input v-model="newCategory.TenLoai" placeholder="Nhập tên loại sách" />
              <textarea v-model="newCategory.MoTa" placeholder="Nhập mô tả loại sách" rows="2" />
              <div class="detail-actions">
                <button class="btn btn-success" @click="addCategory">💾 Lưu</button>
                <button class="btn btn-secondary" @click="cancelAdd">❌ Hủy</button>
              </div>
              <hr />
            </div>

            <div class="scrollable-list">
              <ul>
                <li v-for="cat in filteredCategories" :key="cat.MaLoai" @click="toggleCategory(cat)"
                  class="reader-item">
                  <strong>{{ capitalizeWords(cat.TenLoai) }}</strong>

                  <div v-if="selectedCategory?.MaLoai === cat.MaLoai" class="reader-detail" @click.stop>
                    <div v-if="editingCategoryId === cat.MaLoai" @keyup.enter="saveEdit(cat.MaLoai)">
                      <p><strong>Tên loại sách:</strong></p>
                      <input v-model="editedCategory.TenLoai" />
                      <p><strong>Mô tả:</strong></p>
                      <textarea v-model="editedCategory.MoTa" rows="2" />
                      <div class="detail-actions">
                        <button class="btn btn-success" @click="saveEdit(cat.MaLoai)">💾 Lưu</button>
                        <button class="btn btn-secondary" @click="cancelEdit">❌ Hủy</button>
                      </div>
                    </div>
                    <div v-else>
                      <p><strong>MaLoai:</strong> {{ cat.MaLoai }}</p>
                      <p><strong>Tên loại sách:</strong> {{ cat.TenLoai }}</p>
                      <p><strong>Mô tả:</strong> {{ cat.MoTa }}</p>
                      <p><strong>Số lượng sách thuộc thể loại {{ cat.TenLoai }} có trong thư viện:</strong>
                        {{ countBooksByCategory(cat._id) }}</p>
                      <div class="detail-actions">
                        <button class="btn btn-warning" @click.stop="editCategory(cat)">✏️ Chỉnh sửa</button>
                        <button class="btn btn-danger" @click.stop="deleteCategory(cat)">🗑️ Xóa</button>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import NavBarAD from '@/components/Admin/NavBarAD.vue'
import SideBarAD from '@/components/Admin/SideBarAD.vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useCategoryBookStore } from '@/Store/category.store'
import { capitalizeWords } from '@/utils/stringUtils'
import { useRoute } from 'vue-router'
import { useBookStore } from '@/Store/Book.store'
const categoryBookStore = useCategoryBookStore()
const searchKeyword = ref('')
const selectedCategory = ref(null)
const editingCategoryId = ref(null)
const showAddForm = ref(false)
const route = useRoute()
const newCategory = ref({ TenLoai: '', MoTa: '' })
const editedCategory = ref({ TenLoai: '', MoTa: '' })
const categories = ref([])
const bookStore = useBookStore()
const books = ref([])

onMounted(async () => {
  const dataBook = await bookStore.fetchBooks()
  books.value = Array.isArray(dataBook.danhsachsach) ? dataBook.danhsachsach : []
  const data = await categoryBookStore.fetchCategoryBooks()
  categories.value = Array.isArray(data) ? data : []
})
const countBooksByCategory = (categoryId) => {
  return books.value.filter(book => {
    return Array.isArray(book.MaLoai) && book.MaLoai.some(loai => loai._id === categoryId)
  }).length
}
watch(() => route.name, async (newRoute) => {
  if (newRoute === 'CategoryManagement') {
    const res = await categoryBookStore.fetchCategoryBooks()
    categories.value = Array.isArray(res) ? res : []
  }
}, { immediate: true })
const totalCategories = computed(() => categories.value.length || 0)
const filteredCategories = computed(() => {
  return categories.value.filter(cat =>
    cat.TenLoai.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

function toggleAddForm() {
  selectedCategory.value = null
  editingCategoryId.value = null
  showAddForm.value = !showAddForm.value
  newCategory.value = { TenLoai: '', MoTa: '' }
}

const addCategory = async () => {
  if (!newCategory.value.TenLoai.trim()) {
    ElMessage.warning('⚠️ Vui lòng nhập tên loại sách.')
    return
  }
  try {
    const data = {
      TenLoai: newCategory.value.TenLoai,
      MoTa: newCategory.value.MoTa || ' '
    }
    const res = await categoryBookStore.addOneCategoryBook(data)
    if (res.message === 'Thêm loại sách thành công.') {
      ElMessage.success('Thêm loại sách thành công.')
      categories.value = await categoryBookStore.fetchCategoryBooks()
      toggleAddForm()
    } else {
      ElMessage.error(res.message)
    }
  } catch (err) {
    ElMessage.error('Lỗi xảy ra khi thêm loại sách.')
  }
}

function cancelAdd() {
  toggleAddForm()
}

function toggleCategory(cat) {
  showAddForm.value = false
  if (editingCategoryId.value !== null) return
  selectedCategory.value = selectedCategory.value?.MaLoai === cat.MaLoai ? null : cat
}

function editCategory(cat) {
  editingCategoryId.value = cat.MaLoai
  editedCategory.value = { TenLoai: cat.TenLoai, MoTa: cat.MoTa }
}

function cancelEdit() {
  editingCategoryId.value = null
  editedCategory.value = { TenLoai: '', MoTa: '' }
}

const saveEdit = async (MaLoai) => {
  try {
    const data = {
      MaLoai: MaLoai,
      TenLoai: editedCategory.value.TenLoai,
      MoTa: editedCategory.value.MoTa || ' '
    }
    const res = await categoryBookStore.updateCategoryBook(data)
    if (res.message === 'Cập nhật loại sách thành công.') {
      ElMessage.success('Cập nhật loại sách thành công.')
      categories.value = await categoryBookStore.fetchCategoryBooks()
      selectedCategory.value = null
      editingCategoryId.value = null
    } else {
      ElMessage.error(res.message)
    }
  } catch (err) {
    ElMessage.error('Lỗi xảy ra khi cập nhật loại sách')
  }
}

async function deleteCategory(cat) {
  try {
    await ElMessageBox.confirm(
      `Bạn có chắc chắn muốn xóa loại sách "${cat.TenLoai}" không?`,
      'Xác nhận xóa',
      {
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    )
    const res = await categoryBookStore.deleteCategoryBook(cat.MaLoai)
    if (res.message === 'Đã xóa loại sách thành công.') {
      ElMessage.success(`Xóa loại sách tên ${cat.TenLoai} thành công.`)
      const data = await categoryBookStore.fetchCategoryBooks()
      categories.value = Array.isArray(data) ? data : []
    } else {
      ElMessage.error(res.message)
    }
    selectedCategory.value = null
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('Xóa thất bại.')
    } else {
      ElMessage.error('Hủy thao tác xóa.')
    }
  }
}
</script>

<style scoped>
.overlay {
  position: fixed;
  padding: 15px;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(20, 20, 20, 0.85);
  overflow-y: auto;
  z-index: 1;
}

.publisher-management {
  margin-top: 105px !important;
  width: 65%;
  max-width: 65%;
  background: #fff;
  padding: 30px;
  margin: 0 auto;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  font-family: 'Segoe UI', sans-serif;
  z-index: 2;
  position: relative;
  box-sizing: border-box;
}

.title {
  text-align: center;
  font-size: 28px;
  margin-bottom: 25px;
  color: #2c3e50;
}

.top-bar input {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  width: 100%;
  min-width: 250px;
}

.total-btn,
.add-btn {
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
  border: none;
}

.total-btn {
  background-color: #f1f1f1;
  color: #333;
  border: 1px solid #ccc;
}

.add-btn {
  background-color: #3498db;
  color: white;
}

.add-btn:hover {
  background-color: #2980b9;
}

.reader-list {
  background: #f8f8f8;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #ccc;
  max-height: 400px;
  overflow-y: auto;
}

.scrollable-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.reader-item {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
}

.reader-detail {
  background-color: #fff;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-top: 10px;
}

.detail-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.add-form input,
.add-form textarea,
.reader-detail input,
.reader-detail textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 15px;
  box-sizing: border-box;
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

.btn-success {
  background-color: #27ae60;
  color: white;
}

.btn-secondary {
  background-color: #7f8c8d;
  color: white;
}

@media (max-width: 768px) {
  .publisher-management {
    padding: 15px;
    border-radius: 12px;
    width: 95%;
    max-width: 95%;
  }

  .title {
    font-size: 22px;
  }

  .top-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .top-bar input,
  .total-btn,
  .add-btn {
    width: 100% !important;
  }

  .detail-actions {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
