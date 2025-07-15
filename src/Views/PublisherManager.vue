<template>
  <div class="overlay">
    <SideBarAD />
    <div class="publisher-management">
      <h1 class="title">Quản lý nhà xuất bản</h1>

      <!-- Top Bar -->
      <div class="top-bar">
        <button class="total-btn">Tổng NXB: {{ totalPublishers }}</button>
        <div class="search" v-if="!showAddForm">
          <input v-model="searchKeyword" placeholder="Tìm kiếm theo tên NXB..." />
        </div>
        <button class="add-btn" @click="toggleAddForm">
          {{ showAddForm ? '❌ Hủy thêm' : '➕ Thêm NXB' }}
        </button>
      </div>



      <!-- Danh sách NXB -->
      <div class="reader-list">
        <h3 class="text-center">Danh sách nhà xuất bản</h3>
        <!-- Form Thêm NXB -->
        <div v-if="showAddForm" class="add-form" @keyup.enter="addPublisher">
          <input v-model="newPublisher.TenNXB" placeholder="Nhập tên nhà xuất bản" />
          <textarea v-model="newPublisher.DiaChi" placeholder="Nhập địa chỉ" rows="2" />
          <div class="detail-actions">
            <button class="btn btn-success" @click="addPublisher">💾 Lưu</button>
            <button class="btn btn-secondary" @click="cancelAdd">❌ Hủy</button>
          </div>
          <hr />
        </div>
        <div class="scrollable-list">
          <ul>
            <li v-for="pub in filteredPublishers" :key="pub.MaNXB" @click="togglePublisher(pub)" class="reader-item">
              <strong>{{ capitalizeWords(pub.TenNXB) }}</strong>

              <div v-if="selectedPublisher?.MaNXB === pub.MaNXB" class="reader-detail" @click.stop>
                <div v-if="editingPublisherId === pub.MaNXB" @keyup.enter="saveEdit(pub.MaNXB)">
                  <p><strong>Tên NXB:</strong></p>
                  <input v-model="editedPublisher.TenNXB" />
                  <p><strong>Địa chỉ:</strong></p>
                  <textarea v-model="editedPublisher.DiaChi" rows="2" />
                  <div class="detail-actions">
                    <button class="btn btn-success" @click="saveEdit(pub.MaNXB)">💾 Lưu</button>
                    <button class="btn btn-secondary" @click="cancelEdit">❌ Hủy</button>
                  </div>
                </div>

                <div v-else>
                  <p><strong>Mã NXB:</strong> {{ pub.MaNXB }}</p>
                  <p><strong>Tên NXB:</strong> {{ capitalizeWords(pub.TenNXB) }}</p>
                  <p><strong>Địa chỉ:</strong> {{ capitalizeWords(pub.DiaChi) }}</p>
                  <div class="detail-actions">
                    <button class="btn btn-warning" @click.stop="editPublisher(pub)">✏️ Chỉnh sửa</button>
                    <button class="btn btn-danger" @click.stop="deletePublisher(pub)">🗑️ Xóa</button>
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
import SideBarAD from '@/components/Admin/SideBarAD.vue'
import { usePublisherStore } from '@/Store/publisher.store'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { capitalizeWords } from '@/utils/stringUtils'

const publisherStore = usePublisherStore()
const router = useRouter()
const searchKeyword = ref('')
const selectedPublisher = ref(null)
const editingPublisherId = ref(null)
const showAddForm = ref(false)

const newPublisher = ref({ TenNXB: '', DiaChi: '' })
const editedPublisher = ref({ TenNXB: '', DiaChi: '' })

onMounted(() => {
  publisherStore.fetchPublishers()
})

const totalPublishers = computed(() => publisherStore.publishers?.length || 0)

const filteredPublishers = computed(() => {
  return publisherStore.publishers?.filter((p) =>
    p.TenNXB.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

function togglePublisher(pub) {
  showAddForm.value = false
  if (editingPublisherId.value !== null) return
  selectedPublisher.value =
    selectedPublisher.value?.MaNXB === pub.MaNXB ? null : pub
}

function toggleAddForm() {
  editingPublisherId.value = null
  selectedPublisher.value = null
  showAddForm.value = !showAddForm.value
  newPublisher.value = { TenNXB: '', DiaChi: '' }
}

function cancelAdd() {
  toggleAddForm()
}

async function addPublisher() {
  if (!newPublisher.value.TenNXB.trim()) {
    alert('⚠️ Vui lòng nhập tên nhà xuất bản.')
    return
  }
  if (!newPublisher.value.DiaChi.trim()) {
    alert('⚠️ Vui lòng nhập địa chỉ nhà xuất bản.')
    return
  }
  console.log(newPublisher)
  try {
    const response = await publisherStore.addPublisher({
      TenNXB: newPublisher.value.TenNXB,
      DiaChi: newPublisher.value.DiaChi
    })

    if (response.message === 'Thêm nhà xuất bản thành công') {
      ElMessage.success('Thêm nhà xuất bản thành công.')
      await publisherStore.fetchPublishers()
      toggleAddForm()
    } else {
      ElMessage.error(response.message)
    }
  } catch (err) {
    ElMessage.error('Lỗi khi thêm nhà xuất bản')
  }
}

function editPublisher(pub) {
  editingPublisherId.value = pub.MaNXB
  editedPublisher.value = {
    TenNXB: pub.TenNXB,
    DiaChi: pub.DiaChi
  }
}

function cancelEdit() {
  editingPublisherId.value = null
  editedPublisher.value = { TenNXB: '', DiaChi: '' }
}

async function saveEdit(MaNXB) {
  try {
    const data = {
      MaNXB: MaNXB,
      TenNXB: editedPublisher.value.TenNXB,
      DiaChi: editedPublisher.value.DiaChi
    }
    const response = await publisherStore.update(data)
    if (response.message === 'Cập nhật nhà xuất bản thành công.') {
      ElMessage.success('Cập nhật nhà xuất bản thành công.')
      await publisherStore.fetchPublishers()
      editingPublisherId.value = null
      selectedPublisher.value = null
    } else {
      ElMessage.error(response.message)
    }
  } catch (err) {
    ElMessage.error('Có lỗi xảy ra khi cập nhật nhà xuất bản.')
  }
}

async function deletePublisher(pub) {
  try {
    await ElMessageBox.confirm(
      `Bạn có chắc chắn muốn xóa nhà xuất bản "${pub.TenNXB}" không?`,
      'Xác nhận xóa',
      {
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    )

    const response = await publisherStore.deletePublisher(pub.MaNXB)
    if (response.message === 'Xóa nhà xuất bản thành công.') {
      ElMessage.success(`Xóa nhà xuất bản tên ${pub.TenNXB} thành công.`)
      await publisherStore.fetchPublishers()
    } else {
      ElMessage.error(response.message)
    }
    selectedPublisher.value = null
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('❌ Xóa thất bại.')
      console.error(error)
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
  left: 5px;
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

.publisher-management {
  width: 65%;
  max-width: 65%;
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
  margin-top: 10px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
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
</style>
