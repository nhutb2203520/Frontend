<template>
    <div class="overlay">
  
      <div class="book-management">
        <h1 class="title">Thêm sách mới</h1>
  
        <form class="book-form" @submit.prevent="submitBook">
          <!-- Ảnh minh họa -->
          <div class="form-group">
            <label>Ảnh sách:</label>
            <input type="file" accept="image/*" @change="handleImageUpload" />
            <div v-if="previewImage" class="preview-img">
              <img :src="previewImage" alt="Xem trước ảnh" />
            </div>
          </div>
  
          <div class="form-group">
            <label>Tên sách:</label>
            <input type="text" v-model="book.name" required />
          </div>
  
          <div class="form-group">
            <label>Tác giả:</label>
            <input type="text" v-model="book.author" required />
          </div>
  
          <div class="form-group">
            <label>Số lượng:</label>
            <input type="number" v-model="book.quantity" required min="1" />
          </div>
  
          <div class="form-group">
            <label>Năm xuất bản:</label>
            <input type="number" v-model="book.year" required min="1000" max="2100" />
          </div>
  
          <div class="form-group">
            <label>Vị trí sách:</label>
            <input type="text" v-model="book.location" required />
          </div>
  
          <div class="form-group">
            <label>Mô tả:</label>
            <textarea v-model="book.description" rows="4" placeholder="Mô tả ngắn..."></textarea>
          </div>
  
          <!-- ✅ Nút Hủy và Thêm -->
          <div class="button-group">
            <button type="button" class="cancel-btn" @click="cancelAdd">❌ Hủy</button>
            <button type="submit" class="add-btn">📚 Thêm sách</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
    
  
  export default {
    name: "AddBook",
    components: {
     
    },
    data() {
      return {
        sidebarOpen: true,
        previewImage: null,
        book: {
          name: "",
          author: "",
          quantity: 1,
          year: new Date().getFullYear(),
          location: "",
          description: "",
          image: null,
        },
      };
    },
    methods: {
      handleSidebarToggle(isOpen) {
        this.sidebarOpen = isOpen;
      },
      handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
          this.book.image = file;
          this.previewImage = URL.createObjectURL(file);
        }
      },
      submitBook() {
        console.log("📦 Sách đã được thêm:", this.book);
        alert("✅ Thêm sách thành công!");
        this.$router.push("/admin/book-management");
        
      },
      cancelAdd() {
        if (confirm("Bạn có chắc chắn muốn hủy thêm sách và quay lại không?")) {
          this.$router.push("/admin/book-management");
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
  
  .book-management {
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
  
  .book-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
  }
  
  .form-group label {
    margin-bottom: 6px;
    font-weight: bold;
  }
  
  .form-group input,
  .form-group textarea {
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 15px;
  }
  
  .preview-img {
    margin-top: 10px;
  }
  
  .preview-img img {
    max-width: 200px;
    border-radius: 8px;
    border: 1px solid #ddd;
  }
  
  .button-group {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
  }
  
  .add-btn,
  .cancel-btn {
    padding: 12px 25px;
    font-weight: bold;
    font-size: 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.3s;
    border: none;
  }
  
  .add-btn {
    background-color: #27ae60;
    color: white;
  }
  
  .add-btn:hover {
    background-color: #219150;
  }
  
  .cancel-btn {
    background-color: #e74c3c;
    color: white;
  }
  
  .cancel-btn:hover {
    background-color: #c0392b;
  }
  </style>
  