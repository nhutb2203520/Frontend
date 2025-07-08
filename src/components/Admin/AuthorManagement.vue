<template>
    <div class="overlay">
      <div class="location-management">
        <h1 class="title">Quản lý tác giả</h1>
  
        <div class="top-bar">
          <button class="total-btn">Tổng tác giả: {{ totalAuthors }}</button>
          <div class="search">
            <input v-model="searchKeyword" placeholder="Tìm kiếm theo tên tác giả..." />
          </div>
          <button class="add-btn" @click="toggleAddForm">
            {{ showAddForm ? '❌ Hủy thêm' : '➕ Thêm tác giả' }}
          </button>
        </div>
  
        <div class="location-list">
          <h3>Danh sách tác giả</h3>
  
          <div v-if="showAddForm" class="add-form">
            <input v-model="newAuthor.name" placeholder="Nhập tên tác giả" />
            <textarea v-model="newAuthor.description" placeholder="Nhập mô tả tác giả" rows="2" />
            <div class="detail-actions">
              <button class="btn btn-success" @click="addAuthor">💾 Lưu</button>
              <button class="btn btn-secondary" @click="cancelAdd">❌ Hủy</button>
            </div>
            <hr />
          </div>
  
          <div class="scrollable-list">
            <ul>
              <li
                v-for="author in filteredAuthors"
                :key="author.id"
                @click="toggleAuthor(author)"
                class="location-item"
              >
                <strong>{{ author.name }}</strong>
                <div v-if="selectedAuthor?.id === author.id" class="location-detail" @click.stop>
                  <div v-if="editingAuthorId === author.id">
                    <input v-model="editedAuthor.name" placeholder="Tên tác giả" />
                    <textarea v-model="editedAuthor.description" rows="2" placeholder="Mô tả" />
                    <div class="detail-actions">
                      <button class="btn btn-success" @click="saveEdit(author.id)">💾 Lưu</button>
                      <button class="btn btn-secondary" @click="cancelEdit">❌ Hủy</button>
                    </div>
                  </div>
                  <div v-else>
                    <p><strong>ID:</strong> {{ author.id }}</p>
                    <p><strong>Tên tác giả:</strong> {{ author.name }}</p>
                    <p><strong>Mô tả:</strong> {{ author.description }}</p>
                    <div class="detail-actions">
                      <button class="btn btn-warning" @click.stop="editAuthor(author)">✏️ Chỉnh sửa</button>
                      <button class="btn btn-danger" @click.stop="deleteAuthor(author)">🗑️ Xóa</button>
                    </div>
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
  export default {
    data() {
      return {
        searchKeyword: "",
        selectedAuthor: null,
        editingAuthorId: null,
        showAddForm: false,
        newAuthor: { name: "", description: "" },
        editedAuthor: { name: "", description: "" },
        authors: [
          { id: 1, name: "Nguyễn Nhật Ánh", description: "Tác giả nổi tiếng với truyện thiếu nhi." },
          { id: 2, name: "J.K. Rowling", description: "Tác giả bộ truyện Harry Potter." },
          { id: 3, name: "Haruki Murakami", description: "Nhà văn Nhật Bản nổi tiếng." },
        ],
        nextId: 4,
      };
    },
    computed: {
      totalAuthors() {
        return this.authors.length;
      },
      filteredAuthors() {
        return this.authors.filter((author) =>
          author.name.toLowerCase().includes(this.searchKeyword.toLowerCase())
        );
      },
    },
    methods: {
      toggleAddForm() {
        this.showAddForm = !this.showAddForm;
        this.newAuthor = { name: "", description: "" };
      },
      addAuthor() {
        if (!this.newAuthor.name.trim()) {
          alert("⚠️ Vui lòng nhập tên tác giả.");
          return;
        }
        this.authors.push({
          id: this.nextId++,
          name: this.newAuthor.name.trim(),
          description: this.newAuthor.description.trim(),
        });
        alert("✅ Thêm tác giả thành công!");
        this.toggleAddForm();
      },
      cancelAdd() {
        this.toggleAddForm();
      },
      toggleAuthor(author) {
        if (this.editingAuthorId !== null) return;
        this.selectedAuthor = this.selectedAuthor?.id === author.id ? null : author;
      },
      editAuthor(author) {
        this.editingAuthorId = author.id;
        this.editedAuthor = { name: author.name, description: author.description };
      },
      cancelEdit() {
        this.editingAuthorId = null;
        this.editedAuthor = { name: "", description: "" };
      },
      saveEdit(id) {
        if (!this.editedAuthor.name.trim()) {
          alert("⚠️ Vui lòng nhập tên tác giả.");
          return;
        }
        const index = this.authors.findIndex((a) => a.id === id);
        if (index !== -1) {
          this.authors[index].name = this.editedAuthor.name.trim();
          this.authors[index].description = this.editedAuthor.description.trim();
          alert("✅ Cập nhật tác giả thành công!");
        }
        this.cancelEdit();
      },
      deleteAuthor(author) {
        if (confirm(`Bạn có chắc chắn muốn xóa tác giả "${author.name}" không?`)) {
          this.authors = this.authors.filter((a) => a.id !== author.id);
          this.selectedAuthor = null;
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
  .location-management {
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
  .location-list {
    background: #f8f8f8;
    padding: 20px;
    border-radius: 10px;
    border: 1px solid #ccc;
    max-height: 500px;
    overflow-y: auto;
  }
  .scrollable-list ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .location-item {
    padding: 10px;
    border-bottom: 1px solid #ddd;
    cursor: pointer;
  }
  .location-detail {
    background-color: #fff;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    margin-top: 10px;
  }
  .add-form input,
  .add-form textarea,
  .location-detail input,
  .location-detail textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 15px;
  }
  .detail-actions {
    margin-top: 10px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
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
  </style>
  