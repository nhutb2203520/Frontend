<template>
  <div class="overlay">
    <!-- NavBar trên cùng -->
    <NavBarAD />
    <!-- Sidebar bên trái -->
    <SideBarAD />

    <!-- Nội dung quản lý -->
    <div class="reader-management">
      <h1 class="title">Quản lý nhà xuất bản</h1>

      <!-- Bộ đếm tổng -->
      <div class="top-buttons">
        <button>Tổng NXB: {{ totalPublishers }}</button>
      </div>

      <!-- Tìm kiếm và thêm -->
      <div class="actions">
        <input v-model="searchKeyword" placeholder="Tìm kiếm theo tên NXB..." />
        <button class="add-btn" @click="goToAddPublisher">Thêm NXB</button>
      </div>

      <!-- Danh sách NXB -->
      <div class="reader-list">
        <h3>Danh sách nhà xuất bản</h3>
        <div class="scrollable-list">
          <ul>
            <li
              v-for="pub in filteredPublishers"
              :key="pub.id"
              class="reader-item"
            >
              <strong>{{ pub.name }}</strong>
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
      publishers: [
        { id: 1, name: "NXB HÀ NỘI" },
        { id: 2, name: "NXB TRẺ" },
        { id: 3, name: "NXB CẦN THƠ" },
        { id: 4, name: "NXB VĨNH LONG" },
        { id: 5, name: "NXB ĐÀ NẴNG" },
        { id: 6, name: "NXB AN GIANG" },
      ]
    };
  },
  computed: {
    totalPublishers() {
      return this.publishers.length;
    },
    filteredPublishers() {
      return this.publishers.filter(p =>
        p.name.toLowerCase().includes(this.searchKeyword.toLowerCase())
      );
    }
  },
  methods: {
    goToAddPublisher() {
      this.$router.push('/admin/add-publisher');
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
}
</style>
