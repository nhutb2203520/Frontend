<template>
  <div class="borrowing-slip container my-5 p-4 border rounded">
    <div class="header text-center border-bottom pb-2 mb-4">
      <h2 class="fst-italic">LỊCH SỬ MƯỢN SÁCH</h2>
    </div>

    <!-- Responsive Table -->
    <div class="table-responsive">
      <table class="table table-bordered text-center">
        <thead class="table-light">
          <tr>
            <th>STT</th>
            <th>Thông tin sách</th>
            <th>Ngày mượn</th>
            <th>Ngày đến hạn trả</th>
            <th>Trạng thái sách</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(borrow, index) in borrowDetails" :key="index">
            <td>{{ index + 1 }}</td>
            <td>
              <strong>{{ capitalizeWords(borrow.MaSach?.TenSach) }}</strong><br />
              <em>Tác giả: {{capitalizeWords(borrow.MaSach?.TacGia?.map(tg => tg.TenTG).join(', '))}}</em>
            </td>
            <td>{{ formatDate(borrow.NgayMuon) }}</td>
            <td>{{ formatDate(borrow.NgayTra) }}</td>
            <td>{{ capitalizeWords(borrow.MaTrangThai?.TenTrangThai) }}</td>
            <td>
              <button v-if="borrow.MaTrangThai?.TenTrangThai === 'đã lấy'" class="btn btn-sm btn-primary"
                @click="extendBorrow(borrow.MaMuonSach, capitalizeWords(borrow.MaSach?.TenSach))">
                Gia hạn
              </button>
              <button v-else-if="borrow.MaTrangThai?.TenTrangThai === 'chờ lấy'" class="btn btn-sm btn-danger"
                @click="cancelBorrow(borrow.MaMuonSach)">
                Huỷ mượn
              </button>
              <button v-else-if="borrow.MaTrangThai?.TenTrangThai === 'đã trả'" class="btn btn-sm btn-success"
                @click="goToBookDetail(borrow.MaSach?.MaSach)">
                Mượn lại
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useBorrowBookStore } from '@/Store/BorrowBook.store';
import { capitalizeWords } from '@/utils/stringUtils';
import { formatDate } from '@/utils/formatDate';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter()
const borrowDetails = ref([]);
const borrowBookStore = useBorrowBookStore();
onMounted(async () => {
  borrowDetails.value = await borrowBookStore.fetchBorrowBooksForUser();
});

// Các hành động
const extendBorrow = async (maMuon, tenSach) => {
  try {
    await ElMessageBox.confirm(
      'Bạn muốn gia hạn quyển sách này?',
      'Xác nhận gia hạn',
      {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Huỷ bỏ',
        type: 'success',
      }
    );
    const res = await borrowBookStore.extendBorrowBook(maMuon)
    if (res.message === 'Gia hạn mượn sách thành công.') {
      ElMessage.success(`Gia hạn quyển sách ${tenSach} thành công.`);
      borrowDetails.value = await borrowBookStore.fetchBorrowBooksForUser();
    } else {
      ElMessage.error(res.message);
    }
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('Đã xảy ra lỗi khi gia hạn phiếu mượn');
    } else {
      ElMessage.error('Hủy thao tác gia hạn.');
    }
  }
}

const cancelBorrow = async (maMuon) => {
  try {
    await ElMessageBox.confirm(
      'Bạn có chắc chắn muốn huỷ yêu cầu mượn sách này không?',
      'Xác nhận huỷ mượn',
      {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Huỷ bỏ',
        type: 'warning',
      }
    );
    const res = await borrowBookStore.cancelBorrowBook(maMuon);
    if (res.message === 'Đã hủy thành công yêu cầu mượn sách.') {
      ElMessage.success(res.message);
      borrowDetails.value = await borrowBookStore.fetchBorrowBooksForUser();
    } else {
      ElMessage.error(res.message);
    }
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('Đã xảy ra lỗi khi huỷ phiếu mượn');
    } else {
      ElMessage.error('Hủy thao tác hủy đăng ký mượn.');
    }
  }
};

const goToBookDetail = (maSach) => {
  router.push(`/book/${maSach}`)
}
</script>

<style scoped>
.borrowing-slip {
  border-width: 2px;
  border-color: black;
  border-radius: 10px;
  box-sizing: border-box;
  background-color: #7d8287ae;
  font-size: 20px;
  /* Giảm cỡ chữ toàn bộ */
}

.header {
border-bottom: 2px solid black;
}

table {
width: 100%;
border-collapse: collapse;
}

table th,
table td {
  vertical-align: middle;
  border: 1px solid black !important;
  white-space: normal;
  /* Cho phép xuống dòng */
  font-size: 30px;
  word-break: break-word;
}

.table thead th {
background-color: #808385 !important;
}

/* Responsive font scaling */
@media (max-width: 992px) {
.borrowing-slip {
  font-size: 18 px;
  padding: 20px;
}

table th,
table td {
  font-size: 16px;
}
}

@media (max-width: 768px) {
.borrowing-slip {
  font-size: 16px;
  padding: 15px;
}

table th,
table td {
  font-size: 14px;
}
}

@media (max-width: 576px) {
.borrowing-slip {
  font-size: 14px;
  padding: 10px;
}

table th,
table td {
  font-size: 13px;
}

h2 {
  font-size: 20px;
}
}
</style>