<template>
  <div class="overlay d-flex">
    <SideBarAD />
    <div class="flex-grow-1">
      <div class="container-fluid px-3">
        <div class="borrow-management mx-auto mt-4">
          <h1 class="title">Quản lý mượn – trả sách</h1>

          <div class="top-buttons d-flex flex-wrap justify-content-center gap-3 mb-4">
            <button @click="filterByStatus('all')">Tất cả: {{ borrowList?.length || 0 }}</button>
            <button @click="filterByStatus('borrowing')">Đang mượn: {{ countByStatus('borrowing') }}</button>
            <button @click="filterByStatus('pending')">Chờ duyệt: {{ countByStatus('pending') }}</button>
            <button @click="filterByStatus('overdue')">Quá hạn: {{ countByStatus('overdue') }}</button>
            <button @click="filterByStatus('returned')">Đã trả: {{ countByStatus('returned') }}</button>
          </div>

          <div class="actions d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
            <input v-model="searchKeyword" placeholder="Tìm kiếm người mượn, sách..." />
            <button v-if="activeFilter === 'overdue' && overdueCount" class="btn btn-warning" @click="remindAll">
              📢 Nhắc tất cả ({{ overdueCount }})
            </button>
          </div>

          <div class="reader-list">
            <h3>Danh sách phiếu mượn</h3>
            <div class="scrollable-list">
              <ul>
                <li v-for="entry in filteredBorrowList" :key="entry.id" @click="selectBorrower(entry)"
                  class="reader-item">
                  <strong>{{ capitalizeWords(entry.reader) }}</strong> - "{{ capitalizeWords(entry.book) }}" -
                  <span :class="'text-' + (entry.isOverdue ? 'danger' : statusLabels[entry.status].color)">
                    {{ entry.isOverdue ? 'Quá hạn' : capitalizeWords(statusLabels[entry.status].text) }}
                  </span>

                  <div v-if="selectedBorrower && selectedBorrower.id === entry.id" class="reader-detail">
                    <p><strong>Họ tên:</strong> {{ entry.reader }}</p>
                    <p><strong>Sách:</strong> {{ entry.book }}</p>
                    <p><strong>Trạng thái:</strong> {{ statusLabels[entry.status].text }}</p>
                    <p><strong>Ngày đăng ký mượn:</strong> {{ formatDate(entry.borrowDate) }}</p>
                    <p><strong>Ngày lấy sách:</strong> {{ entry.getBookDate ? formatDate(entry.getBookDate) :
                      'Bạn chưa lấy sách' }}</p>
                    <p v-if="entry.dueDate"><strong>Hạn trả:</strong> {{ formatDate(entry.dueDate) }}</p>
                    <p v-if="entry.returnDate && entry.status === 'returned'"><strong>Ngày trả:</strong> {{
                      formatDate(entry.returnDate) }}</p>
                    <p v-if="entry.status === 'borrowing' && entry.isOverdue" class="text-danger fw-bold">
                      ⚠️ Quá hạn {{ getOverdueDays(entry.dueDate) }} ngày
                    </p>
                    <div class="detail-actions">
                      <button v-if="entry.status === 'borrowing'" class="btn btn-danger btn-sm"
                        @click.stop="returnBook(entry)">
                        Trả sách
                      </button>
                      <button v-else-if="entry.status === 'pending'" class="btn btn-success btn-sm"
                        @click.stop="approve(entry)">
                        Duyệt mượn
                      </button>
                      <button v-if="entry.status === 'borrowing' && entry.isOverdue" class="btn btn-warning btn-sm"
                        @click.stop="remind(entry)" :disabled="remindingIds.includes(entry.id)">
                        <span v-if="remindingIds.includes(entry.id)">⏳ Đang gửi...</span>
                        <span v-else>Nhắc nhở</span>
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div v-if="filteredBorrowList.length === 0" class="text-center text-muted mt-3 fst-italic">
              Không có kết quả phù hợp
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="isLoading" class="fullscreen-loading">
    <div class="spinner"></div>
    <p>Đang gửi email nhắc nhở...</p>
  </div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import SideBarAD from '@/components/Admin/SideBarAD.vue';
import { useBorrowBookStore } from '@/Store/BorrowBook.store';
import { formatDate } from '../utils/formatDate';
import { capitalizeWords } from '../utils/stringUtils';
import { ElMessage } from 'element-plus';

const borrowBookStore = useBorrowBookStore();
const searchKeyword = ref('');
const selectedBorrower = ref(null);
const activeFilter = ref('all');
const borrowList = ref([]);
const overdueList = ref([]);
const remindingIds = ref([]);
const isLoading = ref(false);

function convertStatus(statusText) {
  switch (statusText?.toLowerCase()) {
    case 'chờ lấy': return 'pending';
    case 'đã lấy': return 'borrowing';
    case 'quá hạn': return 'overdue';
    case 'đã trả': return 'returned';
    default: return 'pending';
  }
}

const statusLabels = {
  borrowing: { text: 'Đang mượn', color: 'primary' },
  pending: { text: 'Chờ duyệt', color: 'warning' },
  overdue: { text: 'Quá hạn', color: 'danger' },
  returned: { text: 'Đã trả', color: 'success' },
};

async function reloadBorrowList() {
  const result = await borrowBookStore.fetchBorrowBooksForAdmin();
  if (Array.isArray(result)) {
    borrowList.value = result.map((entry) => convertEntry(entry));
  } else {
    borrowList.value = []; // fallback an empty array
  }
}

async function loadOverdueList() {
  const res = await borrowBookStore.fetchBorrowBookDeadline();
  const result = res?.danhsachphieumuon;

  if (Array.isArray(result)) {
    overdueList.value = result.map((entry) => convertEntry(entry));
  } else {
    overdueList.value = [];
  }
}

function convertEntry(entry) {
  const status = convertStatus(entry.MaTrangThai?.TenTrangThai);
  const dueDate = entry.NgayTra ? new Date(entry.NgayTra) : null;
  const today = new Date();
  const isOverdue = status === 'borrowing' && dueDate && dueDate < today;

  return {
    id: entry._id,
    reader: entry.MaDocGia?.HoTen || 'Không rõ',
    book: entry.MaSachCopy?.MaSach?.TenSach || 'Không rõ',
    status,
    isOverdue,
    borrowDate: entry.createdAt,
    getBookDate: entry.NgayMuon,
    dueDate,
    returnDate: entry.NgayTra || null,
    raw: entry
  };
}

const filteredBorrowList = computed(() => {
  let list = activeFilter.value === 'overdue' ? overdueList.value : borrowList.value;
  if (activeFilter.value !== 'all' && activeFilter.value !== 'overdue') {
    list = list.filter(e => e.status === activeFilter.value);
  }
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    list = list.filter(e =>
      e.reader.toLowerCase().includes(keyword) ||
      e.book.toLowerCase().includes(keyword)
    );
  }
  return list;
});

const overdueCount = computed(() => overdueList.value.length);
function countByStatus(status) {
  if (status === 'overdue') return overdueList.value.length;
  return borrowList.value.filter(e => e.status === status).length;
}

function getOverdueDays(due) {
  const today = new Date();
  const diff = today - new Date(due);
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function filterByStatus(status) {
  activeFilter.value = status;
  selectedBorrower.value = null;
  if (status === 'overdue') loadOverdueList();
}

function selectBorrower(entry) {
  selectedBorrower.value = selectedBorrower.value?.id === entry.id ? null : entry;
}

async function approve(entry) {
  try {
    const data = {
      MaMuonSach: entry.raw.MaMuonSach,
      TrangThai: 'đã lấy'
    };
    const res = await borrowBookStore.updateBorrowBook(data);
    if (res.message?.includes('thành công')) {
      ElMessage.success(res.message);
      await reloadBorrowList();
    } else ElMessage.error(res.message || 'Duyệt mượn thất bại');
  } catch (err) {
    ElMessage.error('Lỗi khi duyệt phiếu mượn.');
  }
}

async function returnBook(entry) {
  try {
    const data = {
      MaMuonSach: entry.raw.MaMuonSach,
      TrangThai: 'đã trả'
    };
    const res = await borrowBookStore.updateBorrowBook(data);
    if (res.message?.includes('thành công')) {
      ElMessage.success(res.message);
      await reloadBorrowList();
      await loadOverdueList()
    } else ElMessage.error(res.message || 'Duyệt trả thất bại');
  } catch (err) {
    ElMessage.error('Lỗi khi duyệt độc giả trả sách');
  }
}

async function remind(entry) {
  const id = entry.id;
  if (remindingIds.value.includes(id) || isLoading.value) return;

  remindingIds.value.push(id);
  isLoading.value = true;
  try {
    const MaMuonSach = entry.raw.MaMuonSach
    const res = await borrowBookStore.sendEmailRemind(MaMuonSach)
    if (res.message === 'Gửi email thông báo quá hạn trả sách thành công.') {
      ElMessage.success(res.message)
      await reloadBorrowList();
    } else {
      ElMessage.error(res.message || 'Lỗi gửi email.')
    }
  } catch (err) {
    ElMessage.error('Lỗi khi gửi email nhắc nhở độc giả quá hạn trả sách.')
  } finally {
    remindingIds.value = remindingIds.value.filter((r) => r !== id);
    selectedBorrower.value = null
    isLoading.value = false;
  }
}

async function remindAll() {
  if (isLoading.value) return
  isLoading.value = true
  try {
    for (const entry of overdueList.value) {
      const MaMuonSach = entry.raw.MaMuonSach
      await borrowBookStore.sendEmailRemind(MaMuonSach)
    }
    ElMessage.success('Đã gửi nhắc tất cả thành công.');
  } catch (err) {
    ElMessage.error('Lỗi khi gửi nhắc tất cả.');
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  await reloadBorrowList();
  await loadOverdueList();
});
</script>

<style scoped>
.overlay {
  position: fixed;
  padding: 15px;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(20, 20, 20, 0.85);
  overflow-y: auto;
  z-index: 1;
}

.borrow-management {
  margin-top: 105px !important;
  width: 65%;
  height: 65%;
  max-width: 100%;
  background: #fff;
  padding: 30px;
  margin: 0 auto;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  font-family: 'Segoe UI', sans-serif;
  z-index: 2;
  position: relative;
  box-sizing: border-box;
}

.title {
  text-align: center;
  font-size: 28px;
  margin-bottom: 25px;
  color: #2c3e50;
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

.actions input {
  flex: 1;
  min-width: 250px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 15px;
}

.reader-list {
  background: #f8f8f8;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #ccc;
  max-height: 400px;
  overflow-y: auto;
}

.scrollable-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.reader-item {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
}

.reader-detail {
  background-color: #fff;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-top: 10px;
}

.detail-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

@media (max-width: 768px) {
  .borrow-management {
    padding: 15px;
    border-radius: 12px;
  }

  .title {
    font-size: 22px;
  }

  .top-buttons,
  .actions {
    flex-direction: column;
    align-items: stretch;
  }

  .top-buttons button,
  .actions input,
  .btn {
    width: 100% !important;
  }

  .detail-actions {
    flex-direction: column;
    gap: 8px;
  }
}

/* sendEmail hieu ung loading */
.fullscreen-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(30, 30, 30, 0.7);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
  backdrop-filter: blur(2px);
}

.spinner {
  border: 6px solid #ccc;
  border-top: 6px solid #2980b9;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
