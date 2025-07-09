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
            <div class="search flex-grow-1">
              <input v-model="searchKeyword" placeholder="Tìm kiếm theo tên loại sách..." />
            </div>
            <button class="add-btn" @click="toggleAddForm">
              {{ showAddForm ? '❌ Hủy thêm' : '➕ Thêm loại sách' }}
            </button>
          </div>

          <div class="reader-list">
            <h3>Danh sách loại sách</h3>

            <div v-if="showAddForm" class="add-form">
              <input v-model="newCategory.name" placeholder="Nhập tên loại sách" />
              <textarea v-model="newCategory.description" placeholder="Nhập mô tả loại sách" rows="2" />
              <div class="detail-actions">
                <button class="btn btn-success" @click="addCategory">💾 Lưu</button>
                <button class="btn btn-secondary" @click="cancelAdd">❌ Hủy</button>
              </div>
              <hr />
            </div>

            <div class="scrollable-list">
              <ul>
                <li
                  v-for="cat in filteredCategories"
                  :key="cat.id"
                  @click="toggleCategory(cat)"
                  class="reader-item"
                >
                  <strong>{{ cat.name }}</strong>

                  <div v-if="selectedCategory?.id === cat.id" class="reader-detail" @click.stop>
                    <div v-if="editingCategoryId === cat.id">
                      <p><strong>Tên loại sách:</strong></p>
                      <input v-model="editedCategory.name" />
                      <p><strong>Mô tả:</strong></p>
                      <textarea v-model="editedCategory.description" rows="2" />
                      <div class="detail-actions">
                        <button class="btn btn-success" @click="saveEdit(cat.id)">💾 Lưu</button>
                        <button class="btn btn-secondary" @click="cancelEdit">❌ Hủy</button>
                      </div>
                    </div>
                    <div v-else>
                      <p><strong>ID:</strong> {{ cat.id }}</p>
                      <p><strong>Tên loại sách:</strong> {{ cat.name }}</p>
                      <p><strong>Mô tả:</strong> {{ cat.description }}</p>
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

<script>
import NavBarAD from "@/components/Admin/NavBarAD.vue";
import SideBarAD from "@/components/Admin/SideBarAD.vue";

export default {
  components: { NavBarAD, SideBarAD },
  data() {
    return {
      searchKeyword: "",
      selectedCategory: null,
      editingCategoryId: null,
      showAddForm: false,
      newCategory: { name: "", description: "" },
      editedCategory: { name: "", description: "" },
      categories: [
        { id: 1, name: "Khoa học", description: "Sách về khoa học tự nhiên, công nghệ" },
        { id: 2, name: "Tiểu thuyết", description: "Truyện dài, hư cấu, lãng mạn" },
        { id: 3, name: "Tâm lý học", description: "Tài liệu về hành vi con người, phát triển cá nhân" },
        { id: 4, name: "Kinh doanh", description: "Sách về kinh tế, tài chính, quản trị" },
      ],
      nextId: 5,
    };
  },
  computed: {
    totalCategories() {
      return this.categories.length;
    },
    filteredCategories() {
      return this.categories.filter((cat) =>
        cat.name.toLowerCase().includes(this.searchKeyword.toLowerCase())
      );
    },
  },
  methods: {
    toggleAddForm() {
      this.showAddForm = !this.showAddForm;
      this.newCategory = { name: "", description: "" };
    },
    addCategory() {
      if (!this.newCategory.name.trim()) {
        alert("⚠️ Vui lòng nhập tên loại sách.");
        return;
      }
      try {
        this.categories.push({
          id: this.nextId++,
          name: this.newCategory.name.trim(),
          description: this.newCategory.description.trim(),
        });
        this.toggleAddForm();
        alert("✅ Thêm loại sách thành công!");
      } catch (error) {
        alert("❌ Có lỗi xảy ra khi thêm loại sách.");
      }
    },
    cancelAdd() {
      this.toggleAddForm();
    },
    toggleCategory(cat) {
      if (this.editingCategoryId !== null) return;
      this.selectedCategory = this.selectedCategory?.id === cat.id ? null : cat;
    },
    editCategory(cat) {
      this.editingCategoryId = cat.id;
      this.editedCategory = { name: cat.name, description: cat.description };
    },
    cancelEdit() {
      this.editingCategoryId = null;
      this.editedCategory = { name: "", description: "" };
    },
    saveEdit(id) {
      const index = this.categories.findIndex((c) => c.id === id);
      if (index !== -1) {
        try {
          this.categories[index].name = this.editedCategory.name.trim();
          this.categories[index].description = this.editedCategory.description.trim();
          this.cancelEdit();
          alert("✅ Cập nhật loại sách thành công!");
        } catch (error) {
          alert("❌ Có lỗi xảy ra khi cập nhật.");
        }
      }
    },
    deleteCategory(cat) {
      if (confirm(`Bạn có chắc chắn muốn xóa loại sách "${cat.name}" không?`)) {
        this.categories = this.categories.filter((c) => c.id !== cat.id);
        this.selectedCategory = null;
      }
    },
  },
};
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
