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

        <div v-if="showAddForm" class="add-form">
          <input v-model="newLocation.name" placeholder="Nhập tên vị trí mới" />
          <textarea v-model="newLocation.description" placeholder="Nhập mô tả vị trí mới" rows="2" />
          <div class="detail-actions">
            <button class="btn btn-success" @click="addLocation">💾 Lưu</button>
            <button class="btn btn-secondary" @click="cancelAdd">❌ Hủy</button>
          </div>
          <hr />
        </div>

        <div class="scrollable-list">
          <ul>
            <li
              v-for="loc in filteredLocations"
              :key="loc.id"
              @click="toggleLocation(loc)"
              class="location-item"
            >
              <strong>{{ loc.name }}</strong>
              <div v-if="selectedLocation?.id === loc.id" class="location-detail" @click.stop>
                <div v-if="editingLocationId === loc.id">
                  <p><strong>Tên vị trí:</strong></p>
                  <input v-model="editedLocation.name" />
                  <p><strong>Mô tả:</strong></p>
                  <textarea v-model="editedLocation.description" rows="2" />
                  <div class="detail-actions">
                    <button class="btn btn-success" @click="saveEdit(loc.id)">💾 Lưu</button>
                    <button class="btn btn-secondary" @click="cancelEdit">❌ Hủy</button>
                  </div>
                </div>
                <div v-else>
                  <p><strong>ID:</strong> {{ loc.id }}</p>
                  <p><strong>Tên vị trí:</strong> {{ loc.name }}</p>
                  <p><strong>Mô tả:</strong> {{ loc.description }}</p>
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

<script>
export default {
  data() {
    return {
      searchKeyword: "",
      selectedLocation: null,
      editingLocationId: null,
      showAddForm: false,
      newLocation: { name: "", description: "" },
      editedLocation: { name: "", description: "" },
      locations: [
        { id: 1, name: "A1 - Tầng 1", description: "Khu vực sách công nghệ thông tin" },
        { id: 2, name: "B2 - Tầng 2", description: "Khu vực sách tâm lý và kỹ năng sống" },
        { id: 3, name: "C3 - Tầng 3", description: "Khu vực sách tiểu thuyết, văn học" },
        { id: 4, name: "Kho lưu trữ", description: "Nơi lưu trữ sách ít sử dụng" },
      ],
      nextId: 5,
    };
  },
  computed: {
    totalLocations() {
      return this.locations.length;
    },
    filteredLocations() {
      return this.locations.filter((loc) =>
        loc.name.toLowerCase().includes(this.searchKeyword.toLowerCase())
      );
    },
  },
  methods: {
    toggleAddForm() {
      this.showAddForm = !this.showAddForm;
      this.newLocation = { name: "", description: "" };
    },
    addLocation() {
      if (!this.newLocation.name.trim()) {
        alert("⚠️ Vui lòng nhập tên vị trí.");
        return;
      }
      this.locations.push({
        id: this.nextId++,
        name: this.newLocation.name.trim(),
        description: this.newLocation.description.trim(),
      });
      this.toggleAddForm();
    },
    cancelAdd() {
      this.toggleAddForm();
    },
    toggleLocation(loc) {
      if (this.editingLocationId !== null) return;
      this.selectedLocation = this.selectedLocation?.id === loc.id ? null : loc;
    },
    editLocation(loc) {
      this.editingLocationId = loc.id;
      this.editedLocation = { name: loc.name, description: loc.description };
    },
    cancelEdit() {
      this.editingLocationId = null;
      this.editedLocation = { name: "", description: "" };
    },
    saveEdit(id) {
      const index = this.locations.findIndex((l) => l.id === id);
      if (index !== -1) {
        this.locations[index].name = this.editedLocation.name.trim();
        this.locations[index].description = this.editedLocation.description.trim();
      }
      this.cancelEdit();
    },
    deleteLocation(loc) {
      if (confirm(`Bạn có chắc chắn muốn xóa vị trí "${loc.name}" không?`)) {
        this.locations = this.locations.filter((l) => l.id !== loc.id);
        this.selectedLocation = null;
      }
    },
  },
};
</script>

<style scoped>
/* CSS giữ nguyên như cũ, đã kiểm tra đầy đủ */
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
.add-form textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
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
