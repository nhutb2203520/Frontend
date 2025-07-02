<template>
    <div class="overlay">
        <NavBarAD />
      <div class="reader-management">
        <!-- Tiêu đề -->
        <h1 class="title">Quản lý độc giả</h1>
  
        <!-- Nhóm nút thống kê và điều hướng -->
        <div class="top-buttons">
          <button @click="filterAll">Tổng độc giả: {{ totalReaders }}</button>
          <button @click="filterActive">Độc giả hoạt động: {{ activeReaders }}</button>
          <button @click="filterBlocked">Độc giả bị khóa: {{ blockedReaders }}</button>
        </div>
  
        <!-- Tìm kiếm + Thêm độc giả -->
        <div class="actions">
          <input type="text" v-model="searchKeyword" placeholder="Tìm kiếm theo tên, email..." />
          <button class="add-btn" @click="goToAddReader">Thêm độc giả</button>
        </div>
  
        <!-- Danh sách độc giả -->
        <div class="reader-list">
          <h3>Danh sách độc giả</h3>
          <ul>
            <li v-for="reader in filteredReaders" :key="reader.id">
              {{ reader.name }} - {{ reader.email }} - {{ reader.status }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import NavBarAD from '@/components/Admin/NavBarAD.vue';
  export default {
    components: {
      NavBarAD
    },
    data() {
      return {
        searchKeyword: "",
        filterType: "all", // all | active | blocked
        readers: [
          { id: 1, name: "Nguyễn Văn A", email: "a@gmail.com", status: "active" },
          { id: 2, name: "Lê Thị B", email: "b@gmail.com", status: "blocked" },
          { id: 3, name: "Trần Văn C", email: "c@gmail.com", status: "active" }
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
          .filter(reader => {
            if (this.filterType === "active") return reader.status === "active";
            if (this.filterType === "blocked") return reader.status === "blocked";
            return true;
          })
          .filter(reader =>
            reader.name.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
            reader.email.toLowerCase().includes(this.searchKeyword.toLowerCase())
          );
      }
    },
    methods: {
      filterAll() {
        this.filterType = "all";
      },
      filterActive() {
        this.filterType = "active";
      },
      filterBlocked() {
        this.filterType = "blocked";
      },
      goToAddReader() {
        this.$router.push("/add-reader");
      }
    }
  };
  </script>
  
  <style scoped>
  /* Overlay nền đen mờ toàn màn hình */
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(20, 20, 20, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    overflow-y: auto;
  }
  
  /* Container chính */
  .reader-management {
    max-width: 900px;
    width: 100%;
    background: #fff;
    padding: 30px;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
    font-family: 'Segoe UI', sans-serif;
  }
  
  /* Tiêu đề */
  .title {
    text-align: center;
    font-size: 28px;
    margin-bottom: 25px;
    color: #2c3e50;
  }
  
  /* Nút lọc */
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
  
  /* Tìm kiếm + thêm */
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
  
  /* Danh sách độc giả */
  .reader-list {
    background: #f8f8f8;
    padding: 25px;
    border-radius: 10px;
    border: 1px solid #ccc;
  }
  
  .reader-list h3 {
    margin-bottom: 15px;
    color: #34495e;
  }
  
  .reader-list ul {
    list-style: none;
    padding: 0;
  }
  
  .reader-list li {
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }
  </style>
  