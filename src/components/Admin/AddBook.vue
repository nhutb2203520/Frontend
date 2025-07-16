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
              <div class="d-flex gap-2">
                <div class="dropdown-multi flex-grow-1">
                  <div class="form-control dropdown-toggle" @click.stop="toggleAuthorDropdown">
                    {{ book.authors.length ? authorOptions.filter(author => book.authors.includes(author._id)).map(author => capitalizeWords(author.TenTG)).join(', ') : 'Chọn tác giả' }}
                  </div>
                  <div v-if="showAuthorDropdown" class="dropdown-list">
                    <label v-for="author in authorOptions" :key="author._id" class="dropdown-item">
                      <input type="checkbox" :value="author._id" v-model="book.authors" />
                      <span class="circle"></span> {{ capitalizeWords(author.TenTG) }}
                    </label>
                  </div>
                </div>
                <button type="button" class="btn btn-outline-primary" @click="showAddAuthor = true">+ Tác giả</button>
              </div>
              <div v-if="showAddAuthor" class="mt-2">
                <input v-model="newAuthor.TenTG" class="form-control mb-1" placeholder="Tên tác giả" />
                <textarea v-model="newAuthor.MoTa" class="form-control mb-2" placeholder="Mô tả"></textarea>
                <button type="button" class="btn btn-success btn-sm" @click="addAuthor">Lưu</button>
                <button type="button" class="btn btn-secondary btn-sm ms-2" @click="showAddAuthor = false">Hủy</button>
              </div>
            </div>

            <!-- 4. Loại sách -->
            <div class="form-group" ref="catalogGroup">
              <label>Loại sách:</label>
              <div class="d-flex gap-2">
                <div class="dropdown-multi flex-grow-1">
                  <div class="form-control dropdown-toggle" @click.stop="toggleCatalogDropdown">
                    {{ book.catalogs.length ? catalogOptions.filter(c => book.catalogs.includes(c._id)).map(c => capitalizeWords(c.TenLoai)).join(', ') : 'Chọn loại sách' }}
                  </div>
                  <div v-if="showCatalogDropdown" class="dropdown-list">
                    <label v-for="catalog in catalogOptions" :key="catalog._id" class="dropdown-item">
                      <input type="checkbox" :value="catalog._id" v-model="book.catalogs" />
                      <span class="circle"></span> {{ capitalizeWords(catalog.TenLoai) }}
                    </label>
                  </div>
                </div>
                <button type="button" class="btn btn-outline-primary" @click="showAddCatalog = true">+ Loại</button>
              </div>
              <div v-if="showAddCatalog" class="mt-2">
                <input v-model="newCatalog.TenLoai" class="form-control mb-1" placeholder="Tên loại sách" />
                <textarea v-model="newCatalog.MoTa" class="form-control mb-2" placeholder="Mô tả"></textarea>
                <button type="button" class="btn btn-success btn-sm" @click="addCategoryBook">Lưu</button>
                <button type="button" class="btn btn-secondary btn-sm ms-2" @click="showAddCatalog = false">Hủy</button>
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
              <div ref="descriptionEditor" class="editable-area" contenteditable="true" @input="updateDescription">
                <p><br></p>
              </div>
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
                <div class="d-flex gap-2">
                  <select v-model="copy.publisher" class="form-control" required>
                    <option disabled value="">-- Chọn NXB --</option>
                    <option v-for="publisher in publisherOptions" :key="publisher._id" :value="publisher._id">
                      {{ capitalizeWords(publisher.TenNXB) }}
                    </option>
                  </select>
                  <button type="button" class="btn btn-outline-primary btn-sm" @click="showAddPublisher = true">+ NXB</button>
                </div>
                <div v-if="showAddPublisher" class="mt-2">
                  <input v-model="newPublisher.TenNXB" class="form-control mb-1" placeholder="Tên NXB" />
                  <textarea v-model="newPublisher.DiaChi" class="form-control mb-2" placeholder="Địa chỉ"></textarea>
                  <button type="button" class="btn btn-success btn-sm" @click="addPublisher">Lưu</button>
                  <button type="button" class="btn btn-secondary btn-sm ms-2" @click="showAddPublisher = false">Hủy</button>
                </div>
              </div>
              <div class="form-group">
                <label>Số lượng:</label>
                <input type="number" v-model="copy.quantity" required min="1" class="form-control" />
              </div>
              <div class="form-group">
                <label>Vị trí sách:</label>
                <div class="d-flex gap-2">
                  <select v-model="copy.location" class="form-control" required>
                    <option disabled value="">-- Chọn vị trí --</option>
                    <option v-for="loc in locationOptions" :key="loc._id" :value="loc._id">
                      {{ capitalizeWords(loc.TenViTri) }}
                    </option>
                  </select>
                  <button type="button" class="btn btn-outline-primary btn-sm" @click="showAddLocation = true">+ Vị trí</button>
                </div>
                <div v-if="showAddLocation" class="mt-2">
                  <input v-model="newLocation.TenViTri" class="form-control mb-1" placeholder="Tên vị trí" />
                  <textarea v-model="newLocation.MoTa" class="form-control mb-2" placeholder="Mô tả"></textarea>
                  <button type="button" class="btn btn-success btn-sm" @click="addLocation">Lưu</button>
                  <button type="button" class="btn btn-secondary btn-sm ms-2" @click="showAddLocation = false">Hủy</button>
                </div>
              </div>
              <div class="text-end">
                <button type="button" class="btn btn-danger btn-sm" @click="removeBookCopy(index)">Xóa</button>
              </div>
            </div>

            <div class="text-center my-3">
              <button type="button" class="btn btn-secondary" @click="addBookCopy">+ Thêm sách copy</button>
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
<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import TurndownService from 'turndown';

import { useBookStore } from '@/Store/Book.store';
import { useAuthorStore } from '@/Store/author.store';
import { useCategoryBookStore } from '@/Store/category.store';
import { usePublisherStore } from '@/Store/publisher.store';
import { useLocationStore } from '@/Store/Location.store';

import { capitalizeWords } from '@/utils/stringUtils';

const router = useRouter();
const bookStore = useBookStore();
const authorStore = useAuthorStore();
const categoryStore = useCategoryBookStore();
const publisherStore = usePublisherStore();
const locationStore = useLocationStore();

const overlay = ref(null);
const authorGroup = ref(null);
const catalogGroup = ref(null);
const descriptionEditor = ref(null);

const previewImage = ref(null);
const showAuthorDropdown = ref(false);
const showCatalogDropdown = ref(false);

const showAddAuthor = ref(false);
const showAddCatalog = ref(false);
const showAddPublisher = ref(false);
const showAddLocation = ref(false);

const newAuthor = reactive({ TenTG: '', MoTa: '' });
const newCatalog = reactive({ TenLoai: '', MoTa: '' });
const newPublisher = reactive({ TenNXB: '', DiaChi: '' });
const newLocation = reactive({ TenViTri: '', MoTa: '' });

const book = reactive({
  name: '',
  authors: [],
  catalogs: [],
  year: new Date().getFullYear(),
  description: '',
  image: null
});

const bookCopies = ref([{ name: '', publisher: '', quantity: 1, location: '' }]);

const authorOptions = ref([]);
const catalogOptions = ref([]);
const publisherOptions = ref([]);
const locationOptions = ref([]);

const turndownService = new TurndownService({ headingStyle: 'atx' });
turndownService.addRule('underline', {
  filter: ['u'],
  replacement: (content) => '__' + content + '__'
});

onMounted(async () => {
  authorOptions.value = await authorStore.fetchAuthors();
  catalogOptions.value = await categoryStore.fetchCategoryBooks();
  publisherOptions.value = await publisherStore.fetchPublishers();
  locationOptions.value = await locationStore.fetchLocationBooks();
});

const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    previewImage.value = URL.createObjectURL(file);
    try {
      const result = await bookStore.uploadImageBook(file);
      book.image = result.imgUrl;
    } catch (err) {
      ElMessage.error('Lỗi khi upload ảnh');
    }
  }
};

const updateDescription = () => {
  const html = descriptionEditor.value.innerHTML;
  book.description = turndownService.turndown(html).trim();
};

const formatText = (command) => {
  document.execCommand(command, false, null);
  updateDescription();
};

const toggleAuthorDropdown = () => {
  showAuthorDropdown.value = !showAuthorDropdown.value;
  showCatalogDropdown.value = false;
};

const toggleCatalogDropdown = () => {
  showCatalogDropdown.value = !showCatalogDropdown.value;
  showAuthorDropdown.value = false;
};

const handleClickOutside = (event) => {
  if (showAuthorDropdown.value && !authorGroup.value.contains(event.target)) {
    showAuthorDropdown.value = false;
  }
  if (showCatalogDropdown.value && !catalogGroup.value.contains(event.target)) {
    showCatalogDropdown.value = false;
  }
};

const addAuthor = async () => {
  if (!newAuthor.TenTG) {
    ElMessage.warning("Vui lòng nhập tên tác giả.");
    return;
  }

  const res = await authorStore.addOneAuthor(newAuthor);

  const addedAuthor = res?.tacgia; // ✅ Lấy đúng object tác giả từ response

  if (addedAuthor && addedAuthor._id) {
    ElMessage.success('Thêm tác giả thành công');
    authorOptions.value.push(addedAuthor);
    newAuthor.TenTG = '';
    newAuthor.MoTa = '';
    showAddAuthor.value = false;
  } else {
    ElMessage.error(res.message || "Lỗi khi thêm tác giả");
  }
};


const addCategoryBook = async () => {
  if (!newCatalog.TenLoai) {
    ElMessage.warning("Vui lòng nhập tên loại sách.");
    return;
  }

  const res = await categoryStore.addOneCategoryBook(newCatalog);

  const addedCatalog = res?.loaisach; // ✅ dùng đúng key: loaisach
  
  if (res.message == 'Thêm loại sách thành công.') {
    ElMessage.success('Thêm loại sách thành công');
    catalogOptions.value.push(addedCatalog);
    newCatalog.TenLoai = '';
    newCatalog.MoTa = '';
    showAddCatalog.value = false;
  } else {
    ElMessage.error(res.message || "Lỗi khi thêm loại sách");
  }
};


const addPublisher = async () => { 
  if (!newPublisher.TenNXB) {
    ElMessage.warning("Vui lòng nhập tên nhà xuất bản.");
    return;
  }

  const res = await publisherStore.addOnePublisher(newPublisher);  // 👈 Gọi API
  if (res.message === 'Thêm nhà xuất bản thành công') {
        
    ElMessage.success('Thêm nhà xuất bản thành công');
    publisherOptions.value.push(res.nxb);  // 👈 Cập nhật dropdown
    showAddPublisher.value = false;
    newPublisher.TenNXB = '';
    newPublisher.DiaChi = '';
  } else {
    ElMessage.error(res.message || "Lỗi khi thêm nhà xuất bản");
  }
};
const addLocation = async () => {
  if (!newLocation.TenViTri) {
    ElMessage.warning("Vui lòng nhập tên vị trí.");
    return;
  }

  const res = await locationStore.addLocationBook(newLocation);
  
  if (res && res._id) {
    ElMessage.success('Thêm vị trí thành công');
    locationOptions.value.push(res); // ✅ hiển thị trong select ngay
    newLocation.TenViTri = '';
    newLocation.MoTa = '';
    showAddLocation.value = false;
  } else {
    ElMessage.error(res.message || "Lỗi khi thêm vị trí");
  }
};


const addBookCopy = () => {
  bookCopies.value.push({ name: '', publisher: '', quantity: 1, location: '' });
};

const removeBookCopy = (index) => {
  bookCopies.value.splice(index, 1);
};

const submitBook = async () => {
  const data = {
    TenSach: book.name,
    NamXuatBan: book.year,
    MoTa: book.description,
    image: book.image,
    TacGia: book.authors,
    MaLoai: book.catalogs,
    BanSao: bookCopies.value.map(copy => ({
      TenLoaiBanSao: copy.name,
      SoQuyen: copy.quantity,
      MaViTri: copy.location,
      MaNXB: copy.publisher
    }))
  };
  const res = await bookStore.addOneBook(data);
  if (res.message?.includes('thành công')) {
    ElMessage.success(res.message);
    router.push({ name: 'BookManagement' });
  } else {
    ElMessage.error(res.message || 'Lỗi khi thêm sách');
  }
};

const cancelAdd = () => {
  if (confirm('Bạn có chắc muốn hủy?')) {
    router.push('/admin/book-management');
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

  .form-group label {
    margin-bottom: 6px;
    font-weight: bold;
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
  }

  .copy-section {
    border: 1px solid #c7c7c7;
    border-radius: 8px;
    padding: 16px;
    background: #f9f9f9;
    margin-bottom: 16px;
  }
  </style>
