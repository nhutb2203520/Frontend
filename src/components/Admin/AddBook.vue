<template>
  <div class="overlay d-flex">
    <div class="flex-grow-1">
      <NavBarAD />
      <div class="container-fluid px-3">
        <div class="book-management mx-auto my-4">
          <h1 class="title">Thêm sách mới</h1>

          <form class="book-form" @submit.prevent="submitBook">
            <div class="form-group">
              <label>Ảnh sách:</label>
              <input type="file" accept="image/*" @change="handleImageUpload" class="form-control" />
              <div v-if="previewImage" class="preview-img mt-2">
                <img :src="previewImage" alt="Xem trước ảnh" class="img-thumbnail" />
              </div>
            </div>

            <div class="form-group">
              <label>Tên sách:</label>
              <input type="text" v-model="book.name" required class="form-control" />
            </div>

            <div class="form-group">
              <label>Tác giả:</label>
              <input type="text" v-model="book.author" required class="form-control" />
            </div>

            <div class="form-group">
              <label>Số lượng:</label>
              <input type="number" v-model="book.quantity" required min="1" class="form-control" />
            </div>

            <div class="form-group">
              <label>Năm xuất bản:</label>
              <input type="number" v-model="book.year" required min="1000" max="2100" class="form-control" />
            </div>

            <div class="form-group">
              <label>Vị trí sách:</label>
              <input type="text" v-model="book.location" required class="form-control" />
            </div>

            <div class="form-group">
              <label>Mô tả:</label>
              <textarea v-model="book.description" rows="4" placeholder="Mô tả ngắn..." class="form-control"></textarea>
            </div>

            <div class="button-group d-flex flex-wrap justify-content-center gap-3 mt-4">
              <button type="button" class="cancel-btn" @click="cancelAdd">❌ Hủy</button>
              <button type="submit" class="add-btn">📚 Thêm sách</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBarAD from "@/components/Admin/NavBarAD.vue";

export default {
  name: "AddBook",
  components: { NavBarAD },
  data() {
    return {
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

<style >
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(20, 20, 20, 0.263)  ;
  overflow-y: auto;
  padding: 120px 20px 20px;
  z-index: 1;
}


.book-management {
  
  width: 65%;
  max-width: 65%;
  background: #fff;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  font-family: 'Segoe UI', sans-serif;
  z-index: 2;
}

.title {
  text-align: center;
  font-size: 28px;
  margin-bottom: 25px;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 18px;
}

.preview-img img {
  max-width: 200px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.button-group .add-btn,
.button-group .cancel-btn {
  padding: 12px 25px;
  font-weight: bold;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  transition: 0.3s;
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

@media (max-width: 768px) {
  .book-management {
    padding: 20px;
    border-radius: 12px;
  }

  .title {
    font-size: 22px;
  }

  .button-group {
    flex-direction: column;
  }

  .button-group .add-btn,
  .button-group .cancel-btn {
    width: 100%;
  }
}
</style>