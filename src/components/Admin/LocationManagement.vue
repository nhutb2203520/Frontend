<template>
  <div class="overlay">
    <div class="location-management">
      <h1 class="title">Quản lý vị trí sách</h1>

      <div class="top-bar">
        <button class="total-btn">Tổng vị trí: {{ totalLocations }}</button>
        <div class="search">
          <input v-model="searchKeyword" placeholder="Tìm kiếm theo vị trí..." />
        </div>
        <button class="add-btn" @click="toggleAddForm">
          {{ showAddForm ? '❌ Hủy thêm' : '➕ Thêm vị trí' }}
        </button>
      </div>

      <div class="location-list">
        <h3>Danh sách vị trí sách</h3>

        <!-- Form thêm -->
        <div v-if="showAddForm" class="add-form" @keyup.enter="addLocation">
          <input v-model="newLocation.TenViTri" placeholder="Nhập tên vị trí mới" />
          <textarea v-model="newLocation.MoTa" placeholder="Nhập mô tả vị trí mới" rows="2" />
          <div class="detail-actions">
            <button class="btn btn-success" @click="addLocation">💾 Lưu</button>
            <button class="btn btn-secondary" @click="cancelAdd">❌ Hủy</button>
          </div>
          <hr />
        </div>

        <!-- Danh sách -->
        <div class="scrollable-list">
          <ul>
            <li v-for="loc in filteredLocations" :key="loc.MaViTri" @click="toggleLocation(loc)" class="location-item">
              <strong>{{ capitalizeWords(loc.TenViTri) }}</strong>
              <div v-if="selectedLocation?.MaViTri === loc.MaViTri" class="location-detail" @click.stop>

                <!-- Chỉnh sửa -->
                <div v-if="editingLocationId === loc.MaViTri" @keyup.enter="saveEdit(loc.MaViTri)">
                  <p><strong>Tên vị trí:</strong></p>
                  <input v-model="editedLocation.TenViTri" placeholder="Tên vị trí" />

                  <p><strong>Mô tả:</strong></p>
                  <textarea v-model="editedLocation.MoTa" placeholder="Mô tả vị trí" rows="2" />

                  <div class="detail-actions">
                    <button class="btn btn-success" @click="saveEdit(loc.MaViTri)">💾 Lưu</button>
                    <button class="btn btn-secondary" @click="cancelEdit">❌ Hủy</button>
                  </div>
                </div>

                <!-- Hiển thị -->
                <div v-else>
                  <p><strong>Mã vị trí:</strong> {{ loc.MaViTri }}</p>
                  <p><strong>Tên vị trí:</strong> {{ loc.TenViTri }}</p>
                  <p><strong>Mô tả:</strong> {{ loc.MoTa }}</p>
                  <div class="detail-actions">
                    <button class="btn btn-warning" @click.stop="editLocation(loc)">✏️ Chỉnh sửa</button>
                    <button class="btn btn-danger" @click.stop="deleteLocation(loc)">🗑️ Xóa</button>
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
import { ref, computed, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useLocationStore } from '@/Store/Location.store'
import { capitalizeWords } from '@/utils/stringUtils'
const locationStore = useLocationStore()
const searchKeyword = ref('')
const selectedLocation = ref(null)
const editingLocationId = ref(null)
const showAddForm = ref(false)

const newLocation = ref({ TenViTri: '', MoTa: '' })
const editedLocation = ref({ TenViTri: '', MoTa: '' })

const locations = ref([])

let nextId = ref(5)
onMounted(async () => {
  locations.value = await locationStore.fetchLocationBooks()
})
const totalLocations = computed(() => locations.value.length)

const filteredLocations = computed(() => {
  return locations.value.filter((loc) =>
    loc.TenViTri.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

function toggleAddForm() {
  selectedLocation.value = null
  editingLocationId.value = null
  showAddForm.value = !showAddForm.value
  newLocation.value = { TenViTri: '', MoTa: '' }
}

function cancelAdd() {
  toggleAddForm()
}

const addLocation = async () => {
  if (!newLocation.value.TenViTri.trim()) {
    ElMessage.warning('⚠️ Vui lòng nhập tên vị trí.')
    return
  }
  try {
    const data = {
      TenViTri: newLocation.value.TenViTri,
      MoTa: newLocation.value.MoTa || ' '
    }
    const res = await locationStore.addLocationBook(data)
    if (res.message === 'Thêm vị trí thành công.') {
      ElMessage.success('Thêm ví trí thành công.')
      locations.value = await locationStore.fetchLocationBooks()
      toggleAddForm()
    } else {
      ElMessage.error(res.message)
    }
  } catch (error) {
    ElMessage.error('Đã xảy ra lỗi khi thêm.')
  }
}

function toggleLocation(loc) {
  showAddForm.value = false
  if (editingLocationId.value !== null) return
  selectedLocation.value = selectedLocation.value?.MaViTri === loc.MaViTri ? null : loc
}

function editLocation(loc) {
  editingLocationId.value = loc.MaViTri
  editedLocation.value = { TenViTri: loc.TenViTri, MoTa: loc.MoTa }
}

function cancelEdit() {
  editingLocationId.value = null
  editedLocation.value = { TenViTri: '', MoTa: '' }
}

async function saveEdit(MaViTri) {
  try {
    const data = {
      MaViTri: MaViTri,
      TenViTri: editedLocation.value.TenViTri,
      MoTa: editedLocation.value.MoTa || ' '
    }
    const res = await locationStore.updateLocationBook(data)
    if (res.message === 'Cập nhật vị trí thành công.') {
      ElMessage.success('Cập nhật vị trí thành công.')
      locations.value = await locationStore.fetchLocationBooks()
      selectedLocation.value = null
      editingLocationId.value = null
    } else {
      ElMessage.error(res.message)
    }
  } catch (err) {
    ElMessage.error('Lỗi khi cập nhật vị trí.')
  }
}

async function deleteLocation(loc) {
  try {
    await ElMessageBox.confirm(
      `Bạn có chắc chắn muốn xóa loại sách "${loc.TenViTri}" không?`,
      'Xác nhận xóa',
      {
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    )
    const res = await locationStore.deleteLocationBook(loc.MaViTri)
    if (res.message === 'Đã xóa vị trí thành công.') {
      ElMessage.success(`Xóa vị trí tên ${loc.TenViTri} thành công.`)
      locations.value = await locationStore.fetchLocationBooks()
    } else {
      ElMessage.error(res.message)
    }
    selectedLocation.value = null
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
  box-sizing: border-box;
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
