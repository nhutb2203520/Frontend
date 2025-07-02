<template>
    <div class="overlay">
      <NavBarAD />
  
      <div class="category-management">
        <!-- Tiêu đề -->
        <h1 class="title">Quản lý loại sách</h1>
  
        <!-- Tổng số loại sách -->
        <div class="top-bar">
          <button class="total-btn">Tổng loại sách: {{ totalCategories }}</button>
  
          <!-- Thanh tìm kiếm -->
          <div class="search">
            <input
              type="text"
              v-model="searchKeyword"
              placeholder="Tìm kiếm theo tên loại sách..."
            />
          </div>
  
          <!-- Nút thêm -->
          <button class="add-btn" @click="goToAddCategory">Thêm loại sách</button>
        </div>
  
        <!-- Danh sách loại sách -->
        <div class="category-list">
          <h3>Danh sách loại sách</h3>
          <ul>
            <li v-for="cat in filteredCategories" :key="cat.id">
              {{ cat.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import NavBarAD from "@/components/Admin/NavBarAD.vue";
  
  export default {
    components: {
      NavBarAD,
    },
    data() {
      return {
        searchKeyword: "",
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
      goToAddCategory() {
        this.$router.push("/admin/add-category");
      },
    },
  };
  </script>
  
  <style scoped>
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
  
  .category-management {
    max-width: 900px;
    width: 100%;
    background: #fff;
    padding: 30px;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
    font-family: 'Segoe UI', sans-serif;
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
  
  .category-list {
    background: #f8f8f8;
    padding: 25px;
    border-radius: 10px;
    border: 1px solid #ccc;
  }
  
  .category-list h3 {
    margin-bottom: 15px;
    color: #34495e;
  }
  
  .category-list ul {
    list-style: none;
    padding: 0;
  }
  
  .category-list li {
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }
  </style>
  