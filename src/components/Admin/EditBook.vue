<template>
  <div class="overlay">
    <div class="book-management">
      <h1 class="title">Chỉnh sửa sách</h1>

      <form class="book-form" @submit.prevent="updateBook">
        <!-- Ảnh minh họa -->
        <div class="form-group">
          <label>Ảnh sách:</label>
          <input type="file" accept="image/*" multiple @change="handleImagesUpload" />
          <div v-if="previewImages.length > 0" class="preview-img mt-2 d-flex flex-wrap gap-2">
            <div v-for="(src, idx) in previewImages" :key="idx" class="img-thumb-wrapper">
              <img :src="src" alt="Xem trước" class="img-thumbnail" />
            </div>
          </div>
          <!-- <div v-else-if="previewImageBeforeUpdate" class="preview-img">
            <img :src="'http://localhost:3000' + previewImageBeforeUpdate" alt="Ảnh sách" />
          </div> -->
          <div v-else-if="previewImageBeforeUpdate" class="preview-img mt-2 d-flex flex-wrap gap-2">
            <div v-for="(src, idx) in previewImageBeforeUpdate" :key="idx" class="img-thumb-wrapper">
              <img :src="'http://localhost:3000' + src" alt="ảnh sách" class="img-thumbnail" />
            </div>
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
                  ? authorOptions.filter(author => book.author.includes(author._id)).map(author =>
                    capitalizeWords(author.TenTG)).join(', ')
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
                  ? categoryOptions.filter(cat => book.catalogs.includes(cat._id)).map(cat =>
                    capitalizeWords(cat.TenLoai)).join(', ')
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
          <div class="format-buttons mb-2">
            <button type="button" class="btn btn-outline-dark btn-sm" @click="formatText('bold')"><b>B</b></button>
            <button type="button" class="btn btn-outline-dark btn-sm" @click="formatText('italic')"><i>I</i></button>
            <button type="button" class="btn btn-outline-dark btn-sm" @click="formatText('underline')"><u>U</u></button>
          </div>
          <div ref="descriptionEditor" class="editable-area" contenteditable="true" @input="updateDescription"
            @keydown="handleKeydown" @paste="handlePaste"></div>
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
              {{ capitalizeWords(loc.TenViTri) || loc }}
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
import { ref, reactive, onMounted, computed, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';
import { usePublisherStore } from '@/Store/publisher.store';
import { useLocationStore } from '@/Store/Location.store';
import { useBookStore } from '@/Store/Book.store';
import { capitalizeWords } from '@/utils/stringUtils';
import { useCategoryBookStore } from '@/Store/category.store';
import { useAuthorStore } from '@/Store/author.store';
import TurndownService from 'turndown';

const turndownService = new TurndownService();
turndownService.addRule('underline', {
  filter: ['u'],
  replacement: content => `__${content}__`
});

const bookStore = useBookStore()
const route = useRoute();
const router = useRouter();
const previewImages = ref([]);
const imagesToUpload = ref([]); // chứa File(s)
const showAuthorDropdown = ref(false);
const showCatalogDropdown = ref(false);
const descriptionEditor = ref(null);
const previewImageBeforeUpdate = ref([]);
const book = reactive({
  id: null,
  name: '',
  author: [],
  catalogs: [],
  year: new Date().getFullYear(),
  description: '',
  image: []
});
const bookCopies = ref([]);
const categoryOptions = ref([]);
const publisherOptions = ref([]);
const locationOptions = ref([]);
const authorOptions = ref([]);

// Reactive state for editor content
const editorContent = ref('');
const isUpdating = ref(false);

onMounted(async () => {
  authorOptions.value = await useAuthorStore().fetchAuthors();
  categoryOptions.value = await useCategoryBookStore().fetchCategoryBooks();
  publisherOptions.value = await usePublisherStore().fetchPublishers();
  locationOptions.value = await useLocationStore().fetchLocationBooks();
  await fetchBook();
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
    location: copy.MaViTri
  }));

  // Initialize editor content
  editorContent.value = book.description;

  // Convert markdown to HTML and set to editor after DOM is ready
  await nextTick();
  if (descriptionEditor.value && book.description) {
    const htmlContent = markdownToHTML(book.description);
    descriptionEditor.value.innerHTML = htmlContent;
  }
}

const handleImagesUpload = async (event) => {
  const files = Array.from(event.target.files);
  imagesToUpload.value = files;
  previewImages.value = files.map(f => URL.createObjectURL(f));
  // upload từng file
  const urls = [];
  for (const file of files) {
    try {
      const res = await bookStore.uploadImageBook(file);
      urls.push(res.imgUrl);
    } catch (err) {
      ElMessage.error('Lỗi upload ảnh ' + file.name);
    }
  }
  book.image = urls;
};


function updateDescription() {
  if (isUpdating.value) return;

  isUpdating.value = true;

  const html = descriptionEditor.value.innerHTML;
  if (html.trim() === '<br>' || html.trim() === '') {
    book.description = '';
    editorContent.value = '';
    isUpdating.value = false;
    return;
  }

  try {
    // Use custom HTML to markdown conversion
    const markdown = htmlToMarkdown(html);
    book.description = markdown;
    editorContent.value = markdown;
  } catch (error) {
    console.error('Error converting HTML to markdown:', error);
    // Fallback to turndown service
    const markdown = turndownService.turndown(html);
    book.description = markdown.trim();
    editorContent.value = markdown.trim();
  }

  isUpdating.value = false;
}

// Function to convert markdown to HTML
function markdownToHTML(markdown) {
  if (!markdown) return '';

  return markdown
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/__([^_]+)__/g, '<u>$1</u>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/_([^_]+)_/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}

// Function to convert HTML back to markdown (improved)
function htmlToMarkdown(html) {
  if (!html) return '';

  return html
    .replace(/<strong[^>]*>([^<]+)<\/strong>/g, '**$1**')
    .replace(/<b[^>]*>([^<]+)<\/b>/g, '**$1**')
    .replace(/<u[^>]*>([^<]+)<\/u>/g, '__$1__')
    .replace(/<em[^>]*>([^<]+)<\/em>/g, '*$1*')
    .replace(/<i[^>]*>([^<]+)<\/i>/g, '*$1*')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<div[^>]*>/g, '\n')
    .replace(/<\/div>/g, '')
    .replace(/<p[^>]*>/g, '')
    .replace(/<\/p>/g, '\n')
    .trim();
}

function handleKeydown(event) {
  if (event.key === 'Enter') {
    // Prevent default behavior and handle manually
    event.preventDefault();

    // Insert a line break
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);

    // Create a new line element
    const br = document.createElement('br');
    range.insertNode(br);

    // Move cursor after the break
    range.setStartAfter(br);
    range.setEndAfter(br);
    selection.removeAllRanges();
    selection.addRange(range);

    // Update the description
    updateDescription();
  }
}

function handlePaste(event) {
  event.preventDefault();

  // Get plain text from clipboard
  const text = event.clipboardData.getData('text/plain');

  // Insert plain text at cursor position
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(text));
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  updateDescription();
}

function formatText(command) {
  // Store current cursor position
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  // Apply formatting
  document.execCommand(command, false, null);

  // Update the description
  updateDescription();
}

// Computed property to display formatted segments
const displayDescriptionSegments = computed(() => {
  const raw = editorContent.value || '';
  if (!raw) return [];

  const lines = raw.split('\n');
  const segments = [];
  const regex = /\*\*([^*]+)\*\*|__([^_]+)__|_([^_]+)_|\*([^*]+)\*/g;

  lines.forEach((line, lineIndex) => {
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(line)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        const beforeText = line.slice(lastIndex, match.index);
        if (beforeText) {
          segments.push({ text: beforeText, class: '' });
        }
      }

      // Add formatted text
      if (match[1]) {
        // Bold: **text**
        segments.push({ text: match[1], class: 'fw-bold' });
      } else if (match[2]) {
        // Underline: __text__
        segments.push({ text: match[2], class: 'text-decoration-underline' });
      } else if (match[3] || match[4]) {
        // Italic: _text_ or *text*
        segments.push({ text: match[3] || match[4], class: 'fst-italic' });
      }

      lastIndex = regex.lastIndex;
    }

    // Add remaining text after last match
    if (lastIndex < line.length) {
      const remainingText = line.slice(lastIndex);
      if (remainingText) {
        segments.push({ text: remainingText, class: '' });
      }
    }

    // Add line break except for the last line
    if (lineIndex < lines.length - 1) {
      segments.push({ text: '\n', class: '' });
    }
  });

  return segments;
});

function updateBook() {
  const BanSao = bookCopies.value.map(copy => ({
    _id: copy._id,
    TenLoaiBanSao: copy.name,
    SoQuyen: copy.quantity,
    MaNXB: copy.publisher?._id,
    MaViTri: copy.location?._id
  }));

  const data = {
    TenSach: book.name.trim(),
    TacGia: book.author,
    MaLoai: book.catalogs,
    NamXuatBan: book.year,
    MoTa: book.description,
    image: book.image,
    BanSao
  };

  useBookStore().updateBook(book.id, data)
    .then(result => {
      if (result.message.includes('thành công')) {
        ElMessage.success(result.message);
        router.push('/admin/book-management');
      } else {
        ElMessage.error(result.message || 'Cập nhật thất bại');
      }
    })
    .catch(() => ElMessage.error('Có lỗi xảy ra khi cập nhật sách!'));
}

function cancelEdit() {
  ElMessageBox.confirm('Bạn có chắc chắn muốn hủy chỉnh sửa sách và quay lại không?', 'Xác nhận', {
    confirmButtonText: 'Đồng ý',
    cancelButtonText: 'Hủy',
    type: 'warning'
  }).then(() => router.push('/admin/book-management'));
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
.description-text {
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.description-text .fw-bold {
  font-weight: bold;
}

.description-text .fst-italic {
  font-style: italic;
}

.description-text .text-decoration-underline {
  text-decoration: underline;
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
  font-family: inherit;
}

.editable-area:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.editable-area strong {
  font-weight: bold;
}

.editable-area em {
  font-style: italic;
}

.editable-area u {
  text-decoration: underline;
}

.format-buttons {
  margin-bottom: 8px;
}

.format-buttons button {
  margin-right: 5px;
  border: 1px solid #dee2e6;
  background-color: #fff;
  color: #212529;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.format-buttons button:hover {
  background-color: #f8f9fa;
  border-color: #adb5bd;
}

.format-buttons button:active {
  background-color: #e9ecef;
  border-color: #adb5bd;
}

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

.img-thumbnail {
  width: 200px;
  height: 250px;
}
</style>