<template>
  <div class="overlay">
    <div class="location-management">
      <h1 class="title">Quản lý tác giả</h1>

      <div class="top-bar">
        <button class="total-btn">Tổng tác giả: {{ totalAuthors }}</button>
        <div class="search" v-if="!showAddForm">
          <input v-model="searchKeyword" placeholder="Tìm kiếm theo tên tác giả..." />
        </div>
        <button class="add-btn" @click="toggleAddForm">
          {{ showAddForm ? '❌ Hủy thêm' : '➕ Thêm tác giả' }}
        </button>
      </div>

      <div class="location-list">
        <h3>Danh sách tác giả</h3>

        <div v-if="showAddForm" class="add-form" @keyup.enter="addAuthor">
          <input v-model="newAuthor.TenTG" placeholder="Nhập tên tác giả" />
          <textarea v-model="newAuthor.MoTa" placeholder="Nhập mô tả tác giả" rows="2" />
          <div class="detail-actions">
            <button class="btn btn-success" @click="addAuthor">💾 Lưu</button>
            <button class="btn btn-secondary" @click="cancelAdd">❌ Hủy</button>
          </div>
          <hr />
        </div>

        <div class="scrollable-list">
          <ul>
            <li v-for="author in filteredAuthors" :key="author._id" @click="toggleAuthor(author)" class="location-item">
              <strong>{{ capitalizeWords(author.TenTG) }}</strong>
              <div v-if="selectedAuthor?._id === author._id" class="location-detail" @click.stop>
                <div v-if="editingAuthorId === author._id" @keyup.enter="saveEdit(author._id)">
                  <input v-model="editedAuthor.TenTG" placeholder="Tên tác giả" />
                  <textarea v-model="editedAuthor.MoTa" rows="2" placeholder="Mô tả" />
                  <div class="detail-actions">
                    <button class="btn btn-success" @click="saveEdit(author._id)">💾 Lưu</button>
                    <button class="btn btn-secondary" @click="cancelEdit">❌ Hủy</button>
                  </div>
                </div>
                <div v-else>
                  <p><strong>Tên tác giả:</strong> {{ capitalizeWords(author.TenTG) }}</p>
                  <p><strong>Mô tả:</strong> {{ author.MoTa }}</p>
                  <div class="detail-actions">
                    <button class="btn btn-warning" @click.stop="editAuthor(author)">✏️ Chỉnh sửa</button>
                    <button class="btn btn-danger" @click.stop="deleteAuthor(author)">🗑️ Xóa</button>
                  </div>
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
import { useAuthorStore } from '@/Store/author.store'
import { ref, computed, onMounted, watch } from 'vue'
import { capitalizeWords } from '@/utils/stringUtils'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute } from 'vue-router'
const authorStore = useAuthorStore()
const searchKeyword = ref('')
const showAddForm = ref(false)
const selectedAuthor = ref(null)
const editingAuthorId = ref(null)
const route = useRoute()
const newAuthor = ref({ TenTG: '', MoTa: '' })
const editedAuthor = ref({ TenTG: '', MoTa: '' })
const authors = ref([])
onMounted(async () => {
  const data = await authorStore.fetchAuthors()
  authors.value = Array.isArray(data) ? data : []
})
watch(() => route.name, async (newRoute) => {
  if (newRoute === 'AuthorManagement') {
    const res = await authorStore.fetchAuthors()
    authors.value = Array.isArray(res) ? res : []
  }
}, { immediate: true })

const totalAuthors = computed(() => authors.value.length)

const filteredAuthors = computed(() =>
  authors.value.filter((author) =>
    author.TenTG.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )

)

const toggleAddForm = () => {
  selectedAuthor.value = null
  editingAuthorId.value = null
  showAddForm.value = !showAddForm.value
  newAuthor.value = { TenTG: '', MoTa: '' }
}

const addAuthor = async () => {
  if (!newAuthor.value.TenTG.trim()) {
    alert('⚠️ Vui lòng nhập tên tác giả.')
    return
  }
  try {
    const data = {
      TenTG: newAuthor.value.TenTG,
      MoTa: newAuthor.value.MoTa || ' '
    }
    const res = await authorStore.addOneAuthor(data)
    if (res.message === 'Thêm tác giả thành công.') {
      ElMessage.success('Thêm tác giả thành công.')
      toggleAddForm()
      const data = await authorStore.fetchAuthors()
      authors.value = Array.isArray(data) ? data : []
    } else {
      ElMessage.error(res.message)
    }
  } catch (err) {
    ElMessage.error('Lỗi khi thêm tác giả')
  }
}

const cancelAdd = () => {
  toggleAddForm()
}

const toggleAuthor = (author) => {
  showAddForm.value = false
  if (editingAuthorId.value !== null) return
  selectedAuthor.value =
    selectedAuthor.value?._id === author._id ? null : author
}

const editAuthor = (author) => {
  editingAuthorId.value = author._id
  editedAuthor.value = { TenTG: author.TenTG, MoTa: author.MoTa }
}

const cancelEdit = () => {
  editingAuthorId.value = null
  editedAuthor.value = { TenTG: '', MoTa: '' }
}

const saveEdit = async (id) => {
  if (!editedAuthor.value.TenTG.trim()) {
    alert('⚠️ Vui lòng nhập tên tác giả.')
    return
  }
  try {
    const data = {
      _id: id,
      TenTG: editedAuthor.value.TenTG,
      MoTa: editedAuthor.value.MoTa || ' '
    }
    const res = await authorStore.updateAuthor(data)
    if (res.message === 'Cập nhật tác giả thành công.') {
      ElMessage.success('Cập nhật tác giả thành công.')
      selectedAuthor.value = null
      editingAuthorId.value = null
      const data = await authorStore.fetchAuthors()
      authors.value = Array.isArray(data) ? data : []
    } else {
      ElMessage.error(res.message)
    }
  } catch (err) {
    ElMessage.error('Lỗi khi cập nhật tác giả.')
  }
}

const deleteAuthor = async (author) => {
  try {
    await ElMessageBox.confirm(
      `Bạn có chắc chắn muốn xóa tác giả "${author.TenTG}" không?`,
      'Xác nhận xóa',
      {
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    )

    const res = await authorStore.deleteAuthor(author._id)
    if (res.message === 'Xóa tác giả thành công.') {
      ElMessage.success(`Xóa tác giả tên ${author.TenTG} thành công.`)
      const data = await authorStore.fetchAuthors()
      authors.value = Array.isArray(data) ? data : []
    } else {
      ElMessage.error(res.message)
    }
    selectedAuthor.value = null
  } catch (error) {
    ElMessage({
      type: 'info',
      message: '❌ Đã hủy xóa tác giả.',
    })
  }
}
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
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

.location-management {
  max-width: 900px;
  width: 100%;
  background: #fff;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  font-family: 'Segoe UI', sans-serif;
  z-index: 2;
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
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
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

.search input {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  min-width: 250px;
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

.location-list {
  background: #f8f8f8;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #ccc;
  max-height: 500px;
  overflow-y: auto;
}

.scrollable-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.location-item {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
}

.location-detail {
  background-color: #fff;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-top: 10px;
}

.add-form input,
.add-form textarea,
.location-detail input,
.location-detail textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 15px;
}

.detail-actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
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
</style>