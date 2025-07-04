<template>
    <div class="overlay">
      <div class="book-management">
        <h1 class="title">Chỉnh sửa sách</h1>
  
        <form class="book-form" @submit.prevent="updateBook">
          <!-- Ảnh minh họa -->
          <div class="form-group">
            <label>Ảnh sách:</label>
            <input type="file" accept="image/*" @change="handleImageUpload" />
            <div v-if="previewImage" class="preview-img">
              <img :src="previewImage" alt="Ảnh sách" />
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
            <input type="number" v-model="book.quantity" min="1" required />
          </div>
  
          <div class="form-group">
            <label>Năm xuất bản:</label>
            <input type="number" v-model="book.year" min="1000" max="2100" required />
          </div>
  
          <div class="form-group">
            <label>Vị trí sách:</label>
            <input type="text" v-model="book.location" required />
          </div>
  
          <div class="form-group">
            <label>Mô tả:</label>
            <textarea v-model="book.description" rows="4"></textarea>
          </div>
  
          <!-- ✅ Nút Hủy và Lưu -->
          <div class="button-group">
            <button type="button" class="cancel-btn" @click="cancelEdit">❌ Hủy</button>
            <button type="submit" class="add-btn">💾 Lưu thay đổi</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "EditBook",
    data() {
      return {
        sidebarOpen: true,
        book: {
          id: null,
          name: "",
          author: "",
          quantity: 1,
          year: new Date().getFullYear(),
          location: "",
          description: "",
          image: null,
        },
        previewImage: null,
      };
    },
    created() {
      this.fetchBook();
    },
    methods: {
      fetchBook() {
        const id = this.$route.params.id;
  
        // 🔁 Giả lập dữ liệu sách (có thể thay bằng API thật)
        const mockBooks = [
          {
            id: 1,
            name: "Lập trình Python cơ bản",
            author: "Nguyễn Văn A",
            quantity: 10,
            year: 2021,
            location: "A1",
            description: "Học lập trình Python từ cơ bản đến nâng cao",
            image: null,
          },
          {
            id: 2,
            name: "Tâm lý học hiện đại",
            author: "Trần B",
            quantity: 5,
            year: 2019,
            location: "B3",
            description: "Tổng quan tâm lý học",
            image: null,
          },
        ];
  
        const book = mockBooks.find((b) => b.id === parseInt(id));
        if (book) {
          this.book = { ...book };
        } else {
          alert("Không tìm thấy sách!");
          this.$router.push("/admin/book-management");
        }
      },
      handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
          this.book.image = file;
          this.previewImage = URL.createObjectURL(file);
        }
      },
      updateBook() {
        console.log("✅ Dữ liệu sách sau khi chỉnh sửa:", this.book);
        alert("📘 Cập nhật sách thành công!");
        this.$router.push("/admin/book-management");
      },
      cancelEdit() {
        if (confirm("Bạn có chắc chắn muốn hủy chỉnh sửa sách và quay lại không?")) {
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
  