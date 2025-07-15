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
          <div v-else-if="previewImageBeforeUpdate" class="preview-img">
            <img :src="'http://localhost:3000' + previewImageBeforeUpdate" alt="Ảnh sách" />
          </div>
        </div>

        <div class="form-group">
          <label>Tên sách:</label>
          <input type="text" v-model="book.name" required />
        </div>

        <div class="form-group" ref="authorGroup">
          <label>Tác giả:</label>
          <div class="dropdown-multi">
            <div class="form-control dropdown-toggle" @click.stop="toggleAuthorDropdown">
              {{
                book.author.length
                  ? authorOptions
                    .filter(author => book.author.includes(author._id))
                    .map(author => capitalizeWords(author.TenTG))
                    .join(', ')
                  : 'Chọn tác giả'
              }}
            </div>
            <div v-if="showAuthorDropdown" class="dropdown-list">
              <label v-for="author in authorOptions" :key="author._id" class="dropdown-item">
                <input type="checkbox" :value="author._id" v-model="book.author" />
                <span class="circle"></span> {{ capitalizeWords(author.TenTG) }}
              </label>
            </div>
          </div>
        </div>

        <div class="form-group" ref="catalogGroup">
          <label>Loại sách:</label>
          <div class="dropdown-multi">
            <div class="form-control dropdown-toggle" @click.stop="toggleCatalogDropdown">
              {{
                book.catalogs.length
                  ? categoryOptions
                    .filter(cat => book.catalogs.includes(cat._id))
                    .map(cat => capitalizeWords(cat.TenLoai))
                    .join(', ')
                  : 'Chọn loại sách'
              }}
            </div>
            <div v-if="showCatalogDropdown" class="dropdown-list">
              <label v-for="cat in categoryOptions" :key="cat._id" class="dropdown-item">
                <input type="checkbox" :value="cat._id" v-model="book.catalogs" />
                <span class="circle"></span> {{ capitalizeWords(cat.TenLoai) }}
              </label>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>Năm xuất bản:</label>
          <input type="number" v-model="book.year" min="1000" max="2100" required />
        </div>

        <div class="form-group">
          <label>Mô tả:</label>
          <textarea v-model="book.description" rows="4"></textarea>
        </div>

        <h2 class="title">Sách Copy</h2>
        <div v-for="(copy, index) in bookCopies" :key="index" class="form-group copy-section">
          <label>Tên sách copy:</label>
          <input type="text" v-model="copy.name" required />
          <label>Nhà xuất bản:</label>
          <select v-model="copy.publisher">
            <option disabled value="">-- Chọn NXB --</option>
            <option v-for="publisher in publisherOptions" :key="publisher._id" :value="publisher">
              {{ capitalizeWords(publisher.TenNXB) }}
            </option>
          </select>

          <label>Số lượng:</label>
          <input type="number" v-model="copy.quantity" min="1" required />

          <label>Vị trí:</label>
          <select v-model="copy.location">
            <option disabled value="">-- Chọn vị trí --</option>
            <option v-for="loc in locationOptions" :key="loc._id" :value="loc">
              {{ loc.TenViTri || loc }}
            </option>
          </select>

          <div class="text-end mt-1">
            <button type="button" class="btn btn-sm btn-danger" @click="removeCopy(index)">Xóa</button>
          </div>
        </div>

        <div class="text-center mt-3">
          <button type="button" class="btn btn-secondary" @click="addBookCopy">+ Thêm sách copy</button>
        </div>

        <div class="button-group">
          <button type="button" class="cancel-btn" @click="cancelEdit">❌ Hủy</button>
          <button type="submit" class="add-btn">💾 Lưu thay đổi</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';
import { usePublisherStore } from '@/Store/publisher.store';
import { useLocationStore } from '@/Store/Location.store';
import { useBookStore } from '@/Store/Book.store';
import { capitalizeWords } from '@/utils/stringUtils';
import { useCategoryBookStore } from '@/Store/category.store';
import { useAuthorStore } from '@/Store/author.store';

const route = useRoute();
const router = useRouter();

const previewImage = ref(null);
const showAuthorDropdown = ref(false);
const showCatalogDropdown = ref(false);
const authorGroup = ref(null);
const catalogGroup = ref(null);
const book = reactive({
  id: null,
  name: '',
  author: [],
  catalogs: [],
  year: new Date().getFullYear(),
  description: '',
  image: null,
});

const categoryOptions = ref([]);
const bookCopies = ref([]);
const publisherOptions = ref([]);
const locationOptions = ref([]);
const authorOptions = ref([]);
const previewImageBeforeUpdate = ref('')
onMounted(async () => {
  authorOptions.value = await useAuthorStore().fetchAuthors();
  categoryOptions.value = await useCategoryBookStore().fetchCategoryBooks();
  publisherOptions.value = await usePublisherStore().fetchPublishers();
  locationOptions.value = await useLocationStore().fetchLocationBooks();
  fetchBook();
});

async function fetchBook() {
  const id = route.params.id;
  const bookDetail = await useBookStore().fetchBookByMaSach(id);
  book.id = bookDetail.sach.MaSach;
  book.name = bookDetail.sach.TenSach;
  book.author = bookDetail.sach.TacGia.map(tg => tg._id);
  book.catalogs = bookDetail.sach.MaLoai.map(loai => loai._id);
  book.year = bookDetail.sach.NamXuatBan;
  book.description = bookDetail.sach.MoTa;
  book.image = bookDetail.sach.image;
  previewImageBeforeUpdate.value = book.image;

  bookCopies.value = bookDetail.sachCopies?.map(copy => ({
    _id: copy._id,
    name: capitalizeWords(copy.TenLoaiBanSao),
    quantity: copy.SoQuyen,
    publisher: copy.MaNXB,
    location: copy.MaViTri,
  }));
}

async function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    previewImage.value = URL.createObjectURL(file);

    try {
      const bookStore = useBookStore();
      const result = await bookStore.uploadImageBook(file);

      // ✅ Gán URL ảnh trả về từ server vào this.book.image
      book.image = result.imgUrl;

      console.log("🌄 Đường dẫn ảnh:", result.imgUrl);
    } catch (err) {
      alert("❌ Upload ảnh thất bại");
    }
  }
}

async function updateBook() {
  const BanSao = bookCopies.value.map(copy => ({
    _id: copy._id,
    TenLoaiBanSao: copy.name,
    SoQuyen: copy.quantity,
    MaNXB: copy.publisher?._id,
    MaViTri: copy.location?._id,
  }));

  const data = {
    TenSach: book.name.trim(),
    TacGia: book.author,
    MaLoai: book.catalogs,
    NamXuatBan: book.year,
    MoTa: book.description,
    image: book.image,
    BanSao,
  };

  try {
    const result = await useBookStore().updateBook(book.id, data);
    if (result.message === 'Cập nhật sách và các bản sao thành công.') {
      ElMessage.success(result.message)
      router.push('/admin/book-management');
    } else {
      ElMessage.error(result.message || 'Cập nhật sách thất bại');
    }
  } catch (err) {
    console.error(err);
    ElMessage.error('Có lỗi xảy ra khi cập nhật sách!');
  }
}

function cancelEdit() {
  ElMessageBox.confirm('Bạn có chắc chắn muốn hủy chỉnh sửa sách và quay lại không?', 'Xác nhận', {
    confirmButtonText: 'Đồng ý',
    cancelButtonText: 'Hủy',
    type: 'warning',
  }).then(() => {
    router.push('/admin/book-management');
  });
}

function addBookCopy() {
  bookCopies.value.push({ name: '', publisher: '', quantity: 1, location: '' });
}

function removeCopy(index) {
  bookCopies.value.splice(index, 1);
}

function toggleAuthorDropdown() {
  showAuthorDropdown.value = !showAuthorDropdown.value;
  showCatalogDropdown.value = false;
}

function toggleCatalogDropdown() {
  showCatalogDropdown.value = !showCatalogDropdown.value;
  showAuthorDropdown.value = false;
}
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
.form-group textarea,
.form-group select {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 15px;
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

.copy-section {
  border: 1px solid #c7c7c7;
  border-radius: 8px;
  padding: 16px;
  background: #f9f9f9;
  margin-bottom: 16px;
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
  max-height: 300px;
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
</style>
