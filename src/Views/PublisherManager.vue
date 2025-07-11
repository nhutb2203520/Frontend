<template>
  <div class="overlay">
    <SideBarAD />
    <div class="publisher-management">
      <h1 class="title">Quản lý nhà xuất bản</h1>

      <!-- Thanh công cụ tổng và tìm kiếm -->
      <div class="top-bar">
        <button class="total-btn">Tổng NXB: {{ totalPublishers }}</button>

        <div class="search">
          <input v-model="searchKeyword" placeholder="Tìm kiếm theo tên NXB..." />
        </div>

        <button class="add-btn" @click="toggleAddForm">
          {{ showAddForm ? '❌ Hủy thêm' : '➕ Thêm NXB' }}
        </button>
      </div>

      <!-- Form thêm nhà xuất bản -->
      <div v-if="showAddForm" class="add-form">
        <input v-model="newPublisher.TenNXB" placeholder="Nhập tên nhà xuất bản" />
        <textarea v-model="newPublisher.DiaChi" placeholder="Nhập địa chỉ" rows="2" />
        <div class="detail-actions">
          <button class="btn btn-success" @click="addPublisher">💾 Lưu</button>
          <button class="btn btn-secondary" @click="cancelAdd">❌ Hủy</button>
        </div>
        <hr />
      </div>

      <!-- Danh sách NXB -->
      <div class="reader-list">
        <h3>Danh sách nhà xuất bản</h3>
        <div class="scrollable-list">
          <ul>
            <li v-for="pub in filteredPublishers" :key="pub.MaNXB" @click="togglePublisher(pub)" class="reader-item">
              <strong>{{ pub.TenNXB }}</strong>

              <div v-if="selectedPublisher?.MaNXB === pub.MaNXB" class="reader-detail" @click.stop>
                <div v-if="editingPublisherId === pub.MaNXB">
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
                  <p><strong>Tên NXB:</strong> {{ pub.TenNXB }}</p>
                  <p><strong>Địa chỉ:</strong> {{ pub.DiaChi }}</p>
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

<script>
import SideBarAD from '@/components/Admin/SideBarAD.vue';
import { usePublisherStore } from '@/Store/publisher.store';
import axios from "@/utils/axiosAdmin"; // ✅ Đúng cho Admin


export default {
  components: { SideBarAD },
  data() {
    return {
      searchKeyword: '',
      selectedPublisher: null,
      editingPublisherId: null,
      showAddForm: false,
      newPublisher: { TenNXB: '', DiaChi: '' },
      editedPublisher: { TenNXB: '', DiaChi: '' },
      publisherStore: usePublisherStore(),
    };
  },
  computed: {
    totalPublishers() {
      return this.publisherStore.publishers.length;
    },
    filteredPublishers() {
      return this.publisherStore.publishers.filter((p) =>
        p.TenNXB.toLowerCase().includes(this.searchKeyword.toLowerCase())
      );
    },
  },
  mounted() {
    this.publisherStore.fetchPublishers();
  },
  methods: {
    togglePublisher(pub) {
      if (this.editingPublisherId !== null) return;
      this.selectedPublisher = this.selectedPublisher?.MaNXB === pub.MaNXB ? null : pub;
    },
    toggleAddForm() {
      this.showAddForm = !this.showAddForm;
      this.newPublisher = { TenNXB: '', DiaChi: '' };
    },
    cancelAdd() {
      this.toggleAddForm();
    },
    async addPublisher() {
      if (!this.newPublisher.TenNXB.trim()) {
        alert('⚠️ Vui lòng nhập tên nhà xuất bản.');
        return;
      }

      try {
        const response = await axios.post('/publishers', this.newPublisher);
        if (response.data?.nxb) {
          this.publisherStore.addPublisher(response.data.nxb);
          this.toggleAddForm();
          alert('✅ Thêm nhà xuất bản thành công!');
        } else {
          alert('⚠️ ' + (response.data.message || 'Không thể thêm nhà xuất bản.'));
        }
      } catch (e) {
        alert('❌ Có lỗi xảy ra khi thêm nhà xuất bản.');
      }
    },
    editPublisher(pub) {
      this.editingPublisherId = pub.MaNXB;
      this.editedPublisher = {
        TenNXB: pub.TenNXB,
        DiaChi: pub.DiaChi,
      };
    },
    cancelEdit() {
      this.editingPublisherId = null;
      this.editedPublisher = { TenNXB: '', DiaChi: '' };
    },
    async saveEdit(MaNXB) {
      try {
        const response = await axios.patch(`/publishers/${MaNXB}`, this.editedPublisher);
        const index = this.publisherStore.publishers.findIndex((p) => p.MaNXB === MaNXB);
        if (index !== -1) {
          this.publisherStore.publishers[index] = {
            ...this.publisherStore.publishers[index],
            ...this.editedPublisher,
          };
        }
        this.cancelEdit();
        alert(response.data.message || '✅ Cập nhật thành công!');
      } catch (e) {
        alert('❌ Có lỗi xảy ra khi cập nhật.');
      }
    },
    async deletePublisher(pub) {
      if (confirm(`Bạn có chắc chắn muốn xóa nhà xuất bản "${pub.TenNXB}" không?`)) {
        try {
          const response = await axios.delete(`/publishers/${pub.MaNXB}`);
          this.publisherStore.removePublisher(pub.MaNXB);
          this.selectedPublisher = null;
          alert(response.data.message || '✅ Xóa thành công!');
        } catch (e) {
          alert('❌ Xóa thất bại.');
        }
      }
    },
  },
};
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
