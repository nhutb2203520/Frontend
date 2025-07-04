<template>
  <div class="overlay">
    <NavBarAD />
    <SideBarAD />

    <div class="publisher-management">
      <h1 class="title">Quản lý loại sách</h1>

      <!-- Thanh công cụ tổng và tìm kiếm -->
      <div class="top-bar">
        <button class="total-btn">Tổng loại sách: {{ totalCategories }}</button>

        <div class="search">
          <input
            v-model="searchKeyword"
            placeholder="Tìm kiếm theo tên loại sách..."
          />
        </div>

        <button class="add-btn" @click="goToAddCategory">Thêm loại sách</button>
      </div>

      <!-- Danh sách loại sách -->
      <div class="reader-list">
        <h3>Danh sách loại sách</h3>
        <div class="scrollable-list">
          <ul>
            <li
              v-for="cat in filteredCategories"
              :key="cat.id"
              @click="toggleCategory(cat)"
              class="reader-item"
            >
              <strong>{{ cat.name }}</strong>

              <div
                v-if="selectedCategory?.id === cat.id"
                class="reader-detail"
              >
                <p><strong>ID:</strong> {{ cat.id }}</p>
                <p><strong>Tên loại sách:</strong> {{ cat.name }}</p>
                <div class="detail-actions">
                  <button class="btn btn-warning" @click.stop="editCategory(cat)">
                    ✏️ Chỉnh sửa
                  </button>
                  <button class="btn btn-danger" @click.stop="deleteCategory(cat)">
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
import NavBarAD from '@/components/Admin/NavBarAD.vue';
import SideBarAD from '@/components/Admin/SideBarAD.vue';

export default {
  components: { NavBarAD, SideBarAD },
  data() {
    return {
      searchKeyword: "",
      selectedCategory: null,
      categories: [
        { id: 1, name: "Khoa học" },
        { id: 2, name: "Tiểu thuyết" },
        { id: 3, name: "Tâm lý học" },
        { id: 4, name: "Kinh doanh" },
      ],
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
    toggleCategory(cat) {
      this.selectedCategory =
        this.selectedCategory?.id === cat.id ? null : cat;
    },
    goToAddCategory() {
      this.$router.push('/admin/add-category');
    },
    editCategory(cat) {
      this.$router.push(`/admin/edit-category/${cat.id}`);
    },
    deleteCategory(cat) {
      if (
        confirm(
          `Bạn có chắc chắn muốn xóa loại sách "${cat.name}" không?`
        )
      ) {
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
}
</style>
