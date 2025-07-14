<template>
  <div class="overlay d-flex" ref="overlay" @click="handleClickOutside">
    <div class="flex-grow-1">
      <div class="container-fluid px-3">
        <div class="book-management mx-auto my-4">
          <h1 class="title">Thêm sách mới</h1>
          <h2 class="title">Sách gốc</h2>

          <form class="book-form" @submit.prevent="submitBook">
            <!-- 1. Ảnh sách -->
            <div class="form-group">
              <label>Ảnh sách:</label>
              <input type="file" accept="image/*" @change="handleImageUpload" class="form-control" />
              <div v-if="previewImage" class="preview-img mt-2">
                <img :src="previewImage" alt="Xem trước ảnh" class="img-thumbnail" />
              </div>
            </div>

            <!-- 2. Tên sách -->
            <div class="form-group">
              <label>Tên sách:</label>
              <input type="text" v-model="book.name" required class="form-control" placeholder="Nhập tên sách gốc" />
            </div>

            <!-- 3. Tác giả -->
            <div class="form-group" ref="authorGroup">
              <label>Tác giả:</label>
              <div class="dropdown-multi">
                <div class="form-control dropdown-toggle" @click.stop="toggleAuthorDropdown">
                  {{ book.authors.length ? book.authors.join(', ') : 'Chọn tác giả' }}
                </div>
                <div v-if="showAuthorDropdown" class="dropdown-list">
                  <label v-for="author in authorOptions" :key="author" class="dropdown-item">
                    <input type="checkbox" :value="author" v-model="book.authors" />
                    <span class="circle"></span> {{ author }}
                  </label>
                </div>
              </div>
            </div>

            <!-- 4. Loại sách -->
            <div class="form-group" ref="catalogGroup">
              <label>Loại sách:</label>
              <div class="dropdown-multi">
                <div class="form-control dropdown-toggle" @click.stop="toggleCatalogDropdown">
                  {{ book.catalogs.length ? book.catalogs.join(', ') : 'Chọn loại sách' }}
                </div>
                <div v-if="showCatalogDropdown" class="dropdown-list">
                  <label v-for="catalog in catalogOptions" :key="catalog" class="dropdown-item">
                    <input type="checkbox" :value="catalog" v-model="book.catalogs" />
                    <span class="circle"></span> {{ catalog }}
                  </label>
                </div>
              </div>
            </div>

            <!-- 5. Năm xuất bản -->
            <div class="form-group">
              <label>Năm xuất bản:</label>
              <input type="number" v-model="book.year" required min="1000" max="2100" class="form-control" />
            </div>

            <!-- 6. Mô tả -->
            <div class="form-group">
              <label>Mô tả:</label>
              <div class="format-buttons mb-2">
                <button type="button" class="btn btn-outline-dark btn-sm" @click="formatText('bold')"><b>B</b></button>
                <button type="button" class="btn btn-outline-dark btn-sm" @click="formatText('italic')"><i>I</i></button>
                <button type="button" class="btn btn-outline-dark btn-sm" @click="formatText('underline')"><u>U</u></button>
              </div>
              <div ref="descriptionEditor" class="editable-area" contenteditable="true" @input="updateDescription"></div>
            </div>

            <!-- 7. Sách copy -->
            <h2 class="title">Sách Copy</h2>
            <div v-for="(copy, index) in bookCopies" :key="index" class="copy-section">
              <div class="form-group">
                <label>Tên sách copy:</label>
                <input type="text" v-model="copy.name" required class="form-control" :placeholder="`Tên copy ${index + 1}`" />
              </div>
              <div class="form-group">
                <label>Nhà xuất bản:</label>
                <select v-model="copy.publisher" class="form-control">
                  <option disabled value="">-- Chọn NXB --</option>
                  <option v-for="publisher in publisherOptions" :key="publisher" :value="publisher">
                    {{ publisher }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Số lượng:</label>
                <input type="number" v-model="copy.quantity" required min="1" class="form-control" />
              </div>
              <div class="form-group">
                <label>Vị trí sách:</label>
                <select v-model="copy.location" class="form-control">
                  <option disabled value="">-- Chọn vị trí --</option>
                  <option v-for="loc in locationOptions" :key="loc" :value="loc">{{ loc }}</option>
                </select>
              </div>
              <div class="text-end">
                <button type="button" class="btn btn-danger btn-sm" @click="removeBookCopy(index)">Xóa</button>
              </div>
            </div>

            <!-- Thêm copy -->
            <div class="text-center my-3">
              <button type="button" class="btn btn-secondary" @click="addBookCopy">+ Thêm sách copy</button>
            </div>

            <!-- Nút hành động -->
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
export default {
  name: "AddBook",
  data() {
    return {
      previewImage: null,
      showAuthorDropdown: false,
      showCatalogDropdown: false,
      book: {
        name: "",
        authors: [],
        catalogs: [],
        year: new Date().getFullYear(),
        description: "",
        publisher: "",
        quantity: 1,
        location: "",
        image: null
      },
      bookCopies: [
        { name: "", publisher: "", quantity: 1, location: "" }
      ],
      authorOptions: ["Nguyễn Nhật Ánh", "Trịnh Hữu Tuệ", "J.K. Rowling", "Stephen King"],
      catalogOptions: ["Văn học", "Khoa học", "Thiếu nhi", "Lập trình", "Lịch sử"],
      publisherOptions: ["NXB Kim Đồng", "NXB Trẻ", "NXB Giáo Dục", "NXB Lao Động"],
      locationOptions: ["Tầng 1 - Kệ A", "Tầng 2 - Kệ B", "Tầng 3 - Kệ C"]
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
    formatText(command) {
      document.execCommand(command, false, null);
      this.updateDescription();
    },
    updateDescription() {
      this.book.description = this.$refs.descriptionEditor.innerHTML;
    },
    toggleAuthorDropdown() {
      this.showAuthorDropdown = !this.showAuthorDropdown;
      this.showCatalogDropdown = false;
    },
    toggleCatalogDropdown() {
      this.showCatalogDropdown = !this.showCatalogDropdown;
      this.showAuthorDropdown = false;
    },
    handleClickOutside(event) {
      if (this.showAuthorDropdown && !this.$refs.authorGroup.contains(event.target)) {
        this.showAuthorDropdown = false;
      }
      if (this.showCatalogDropdown && !this.$refs.catalogGroup.contains(event.target)) {
        this.showCatalogDropdown = false;
      }
    },
    addBookCopy() {
      this.bookCopies.push({ name: "", publisher: "", quantity: 1, location: "" });
    },
    removeBookCopy(index) {
      this.bookCopies.splice(index, 1);
    },
    submitBook() {
      const payload = {
        ...this.book,
        copies: this.bookCopies
      };
      console.log("📘 Thêm sách:", payload);
      alert("✅ Thêm sách thành công!");
      this.$router.push("/admin/book-management");
    },
    cancelAdd() {
      if (confirm("Bạn có chắc chắn muốn hủy?")) {
        this.$router.push("/admin/book-management");
      }
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
  background: rgba(20, 20, 20, 0.263);
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
.dropdown-multi {
  position: relative;
}
.dropdown-toggle {
  cursor: pointer;
}
.dropdown-list {
  position: absolute;
  z-index: 1000;
  background: white;
  border: 1px solid #ccc;
  width: 100%;
  overflow-y: auto;
  margin-top: 4px;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  max-height: 540px;
}
.dropdown-item {
  display: flex;
  align-items: center;
  padding: 6px 10px;
  cursor: pointer;
}
.dropdown-item:hover {
  background: #f2f2f2;
}
.dropdown-item input[type="checkbox"] {
  margin-right: 10px;
}
.circle {
  display: inline-block;
  width: 10px;
  height: 10px;
  border: 2px solid #888;
  border-radius: 50%;
  margin-right: 8px;
}
.editable-area {
  min-height: 150px;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 8px;
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.5;
  outline: none;
  background-color: #fff;
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
  .copy-section {
  border: 1px solid #c7c7c7;
  border-radius: 8px;
  padding: 16px;
  background: #f9f9f9;
  margin-bottom: 16px;
}
}
</style>
