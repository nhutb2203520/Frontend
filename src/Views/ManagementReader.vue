<template>
  <div class="overlay">
    <!-- NavBar trên cùng -->
    <NavBarAD />
    <!-- Sidebar bên trái -->
    <SideBarAD />

    <!-- Nội dung quản lý -->
    <div class="reader-management">
      <h1 class="title">Quản lý độc giả</h1>

      <!-- Bộ lọc -->
      <div class="top-buttons">
        <button @click="filterAll">Tổng độc giả: {{ totalReaders }}</button>
        <button @click="filterActive">Hoạt động: {{ activeReaders }}</button>
        <button @click="filterBlocked">Bị khóa: {{ blockedReaders }}</button>
      </div>

      <!-- Tìm kiếm và thêm -->
      <div class="actions">
        <input v-model="searchKeyword" placeholder="Tìm kiếm theo tên hoặc email..." />
        <button class="add-btn" @click="goToAddReader">Thêm độc giả</button>
      </div>

      <!-- Danh sách độc giả -->
      <div class="reader-list">
        <h3>Danh sách độc giả</h3>
        <div class="scrollable-list">
          <ul>
            <li
              v-for="reader in filteredReaders"
              :key="reader.id"
              @click="toggleReader(reader)"
              class="reader-item"
            >
              <strong>{{ reader.name }}</strong> - {{ reader.email }} -
              <span :class="reader.status === 'active' ? 'text-success' : 'text-danger'">
                {{ reader.status === 'active' ? 'Hoạt động' : 'Bị khóa' }}
              </span>

              <!-- Thông tin chi tiết hiện dưới tên -->
              <div v-if="selectedReader?.id === reader.id" class="reader-detail">
                <p><strong>📧 Email:</strong> {{ reader.email }}</p>
                <p>
                  <strong>Trạng thái:</strong>
                  <span :class="reader.status === 'active' ? 'text-success' : 'text-danger'">
                    {{ reader.status === 'active' ? 'Hoạt động' : 'Bị khóa' }}
                  </span>
                </p>
                <button
                  class="btn"
                  :class="reader.status === 'active' ? 'btn-danger' : 'btn-success'"
                  @click.stop="toggleStatus(reader)"
                >
                  {{ reader.status === 'active' ? '🔒 Khóa' : '🔓 Mở khóa' }}
                </button>
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
      filterType: "all",
      selectedReader: null,
      readers: [
        { id: 1, name: "Nguyễn Văn A", email: "a@gmail.com", status: "active" },
        { id: 2, name: "Lê Thị B", email: "b@gmail.com", status: "blocked" },
        { id: 3, name: "Trần Văn C", email: "c@gmail.com", status: "active" },
        { id: 4, name: "Đặng Thị D", email: "d@gmail.com", status: "active" },
        { id: 5, name: "Phạm Văn E", email: "e@gmail.com", status: "active" },
        { id: 6, name: "Ngô Thị F", email: "f@gmail.com", status: "blocked" },
        { id: 7, name: "Nguyễn Văn A", email: "a@gmail.com", status: "active" },
        { id: 8, name: "Lê Thị B", email: "b@gmail.com", status: "blocked" },
        { id: 9, name: "Trần Văn C", email: "c@gmail.com", status: "active" },
        { id: 10, name: "Đặng Thị D", email: "d@gmail.com", status: "active" },
        { id: 11, name: "Phạm Văn E", email: "e@gmail.com", status: "active" },
        { id: 12, name: "Ngô Thị F", email: "f@gmail.com", status: "blocked" },
      ]
    };
  },
  computed: {
    totalReaders() {
      return this.readers.length;
    },
    activeReaders() {
      return this.readers.filter(r => r.status === "active").length;
    },
    blockedReaders() {
      return this.readers.filter(r => r.status === "blocked").length;
    },
    filteredReaders() {
      return this.readers
        .filter(r => {
          if (this.filterType === 'active') return r.status === 'active';
          if (this.filterType === 'blocked') return r.status === 'blocked';
          return true;
        })
        .filter(r =>
          r.name.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
          r.email.toLowerCase().includes(this.searchKeyword.toLowerCase())
        );
    }
  },
  methods: {
    filterAll() {
      this.filterType = 'all';
      this.selectedReader = null;
    },
    filterActive() {
      this.filterType = 'active';
      this.selectedReader = null;
    },
    filterBlocked() {
      this.filterType = 'blocked';
      this.selectedReader = null;
    },
    toggleReader(reader) {
      this.selectedReader = this.selectedReader?.id === reader.id ? null : reader;
    },
    goToAddReader() {
      this.$router.push('/admin/add-reader');
    },
    toggleStatus(reader) {
      reader.status = reader.status === 'active' ? 'blocked' : 'active';
    }
  }
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

.reader-management {
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

.top-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.top-buttons button {
  padding: 12px 20px;
  border: 2px solid #2980b9;
  background-color: white;
  color: #2980b9;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.top-buttons button:hover {
  background-color: #2980b9;
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
  transition: 0.3s;
  cursor: pointer;
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

.text-success {
  color: #28a745;
}

.text-danger {
  color: #dc3545;
}
</style>
