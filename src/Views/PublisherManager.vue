<template>
  <div class="overlay">
    <NavBarAD />
    <SideBarAD />

    <div class="publisher-management">
      <h1 class="title">Quản lý nhà xuất bản</h1>

      <!-- Thanh công cụ tổng và tìm kiếm -->
      <div class="top-bar">
        <button class="total-btn">Tổng NXB: {{ totalPublishers }}</button>

        <div class="search">
          <input
            v-model="searchKeyword"
            placeholder="Tìm kiếm theo tên NXB..."
          />
        </div>

        <button class="add-btn" @click="toggleAddForm">
          {{ showAddForm ? '❌ Hủy thêm' : '➕ Thêm NXB' }}
        </button>
      </div>

      <!-- Form thêm nhà xuất bản -->
      <div v-if="showAddForm" class="add-form">
        <input v-model="newPublisher.name" placeholder="Nhập tên nhà xuất bản" />
        <textarea v-model="newPublisher.address" placeholder="Nhập địa chỉ" rows="2" />
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
            <li
              v-for="pub in filteredPublishers"
              :key="pub.id"
              @click="togglePublisher(pub)"
              class="reader-item"
            >
              <strong>{{ pub.name }}</strong>

              <div
                v-if="selectedPublisher?.id === pub.id"
                class="reader-detail"
                @click.stop
              >
                <!-- Nếu đang chỉnh sửa -->
                <div v-if="editingPublisherId === pub.id">
                  <p><strong>Tên NXB:</strong></p>
                  <input v-model="editedPublisher.name" />
                  <p><strong>Địa chỉ:</strong></p>
                  <textarea v-model="editedPublisher.address" rows="2" />
                  <div class="detail-actions">
                    <button class="btn btn-success" @click="saveEdit(pub.id)">💾 Lưu</button>
                    <button class="btn btn-secondary" @click="cancelEdit">❌ Hủy</button>
                  </div>
                </div>

                <!-- Nếu không chỉnh sửa -->
                <div v-else>
                  <p><strong>ID:</strong> {{ pub.id }}</p>
                  <p><strong>Tên NXB:</strong> {{ pub.name }}</p>
                  <p><strong>Địa chỉ:</strong> {{ pub.address }}</p>
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
import NavBarAD from '@/components/Admin/NavBarAD.vue';
import SideBarAD from '@/components/Admin/SideBarAD.vue';

export default {
  components: { NavBarAD, SideBarAD },
  data() {
    return {
      searchKeyword: "",
      selectedPublisher: null,
      editingPublisherId: null,
      showAddForm: false,
      newPublisher: { name: "", address: "" },
      editedPublisher: { name: "", address: "" },
      nextId: 7,
      publishers: [
        { id: 1, name: "NXB HÀ NỘI", address: "Hà Nội" },
        { id: 2, name: "NXB TRẺ", address: "TP.HCM" },
        { id: 3, name: "NXB CẦN THƠ", address: "Cần Thơ" },
        { id: 4, name: "NXB VĨNH LONG", address: "Vĩnh Long" },
        { id: 5, name: "NXB ĐÀ NẴNG", address: "Đà Nẵng" },
        { id: 6, name: "NXB AN GIANG", address: "An Giang" },
      ],
    };
  },
  computed: {
    totalPublishers() {
      return this.publishers.length;
    },
    filteredPublishers() {
      return this.publishers.filter((p) =>
        p.name.toLowerCase().includes(this.searchKeyword.toLowerCase())
      );
    },
  },
  methods: {
    togglePublisher(pub) {
      if (this.editingPublisherId !== null) return;
      this.selectedPublisher = this.selectedPublisher?.id === pub.id ? null : pub;
    },
    toggleAddForm() {
      this.showAddForm = !this.showAddForm;
      this.newPublisher = { name: "", address: "" };
    },
    addPublisher() {
      if (!this.newPublisher.name.trim()) {
        alert("⚠️ Vui lòng nhập tên nhà xuất bản.");
      return;
      }

      try {
        this.publishers.push({
          id: this.nextId++,
          name: this.newPublisher.name.trim(),
          address: this.newPublisher.address.trim(),
        });
        this.toggleAddForm();
        alert("✅ Thêm nhà xuất bản thành công!");
      } catch (e) {
        alert("❌ Có lỗi xảy ra khi thêm nhà xuất bản.");
      }
    },

    cancelAdd() {
      this.toggleAddForm();
    },
    editPublisher(pub) {
      this.editingPublisherId = pub.id;
      this.editedPublisher = { name: pub.name, address: pub.address };
    },
    cancelEdit() {
      this.editingPublisherId = null;
      this.editedPublisher = { name: "", address: "" };
    },
    saveEdit(id) {
      const index = this.publishers.findIndex((p) => p.id === id);
      if (index !== -1) {
       try {
        this.publishers[index].name = this.editedPublisher.name.trim();
        this.publishers[index].address = this.editedPublisher.address.trim();
        this.cancelEdit();
      alert("✅ Cập nhật thành công!");
    } catch (e) {
      alert("❌ Có lỗi xảy ra khi cập nhật.");
    }
  }
},

    deletePublisher(pub) {
      if (confirm(`Bạn có chắc chắn muốn xóa nhà xuất bản "${pub.name}" không?`)) {
        this.publishers = this.publishers.filter((p) => p.id !== pub.id);
        this.selectedPublisher = null;
      }
    },
  },
};
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

.publisher-management {
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
