<template>
  <div class="borrowing-slip container my-5 p-4 border rounded">
    <div class="header text-center border-bottom pb-2 mb-4">
      <h2 class="fst-italic">LỊCH SỬ MƯỢN SÁCH</h2>
    </div>

    <div class="table-responsive">
      <table class="table table-bordered text-center">
        <thead class="table-light">
          <tr>
            <th>STT</th>
            <th>Thông tin sách</th>
            <th>Loại CSDL</th>
            <th>Ngày mượn</th>
            <th>Ngày đến hạn trả</th>
            <th>Trạng thái sách</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(borrow, index) in borrowDetails" :key="index" :class="{ 'table-danger': isOverdue(borrow) }">
            <td>{{ index + 1 }}</td>
            <td>
              <strong>{{ capitalizeWords(borrow.MaSachCopy?.MaSach?.TenSach) }}</strong><br />
              <em>
                Tác giả:
                {{
                  capitalizeWords(
                    borrow.MaSachCopy.MaSach?.TacGia?.map(tg => tg.TenTG).join(', ')
                  )
                }}
              </em>
            </td>
            <td>{{ borrow.MaSachCopy?.TenLoaiBanSao }}</td>
            <td>{{ formatDate(borrow.NgayMuon) }}</td>
            <td>{{ formatDate(borrow.NgayTra) }}</td>
            <td>
              <span v-if="isOverdue(borrow)" class="text-danger fw-bold">Quá hạn</span>
              <span v-else>{{ capitalizeWords(borrow.MaTrangThai?.TenTrangThai) }}</span>
            </td>

            <td>
              <!-- Nếu quá hạn -->
              <div v-if="isOverdue(borrow)">
                <p class="text-danger fw-bold mb-1">
                  📢 Sách này đã quá hạn {{ overdueDays(borrow) }} ngày.
                </p>
                <small class="text-danger">
                  Vui lòng trả sách tại thư viện để tránh bị xử lý.
                </small>
              </div>

              <!-- Nếu trạng thái là đã lấy và chưa quá hạn -->
              <button v-else-if="borrow.MaTrangThai?.TenTrangThai === 'đã lấy'" class="btn btn-sm btn-primary"
                @click="extendBorrow(borrow.MaMuonSach, borrow.MaSachCopy.MaSach?.TenSach)">
                Gia hạn
              </button>
              <!-- Nếu chờ lấy -->
              <button v-else-if="borrow.MaTrangThai?.TenTrangThai === 'chờ lấy'" class="btn btn-sm btn-danger"
                @click="cancelBorrow(borrow.MaMuonSach)">
                Huỷ mượn
              </button>

              <!-- Nếu đã trả -->
              <button v-else-if="borrow.MaTrangThai?.TenTrangThai === 'đã trả'" class="btn btn-sm btn-success"
                @click="goToBookDetail(borrow.MaSachCopy.MaSach?.MaSach)">
                Mượn lại
              </button>
              <p v-if="borrow.DaGiaHan && borrow.MaTrangThai?.TenTrangThai === 'đã lấy' && !isOverdue(borrow)"
                class="text-secondary gia-han-note">
                Đã gia hạn</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import dayjs from 'dayjs';

import { useBorrowBookStore } from '@/Store/BorrowBook.store';
import { capitalizeWords } from '@/utils/stringUtils';
import { formatDate } from '@/utils/formatDate';

const borrowBookStore = useBorrowBookStore();
const borrowDetails = ref([]);
const router = useRouter();

onMounted(async () => {
  borrowDetails.value = await borrowBookStore.fetchBorrowBooksForUser();
});

const isOverdue = (borrow) => {
  const status = borrow.MaTrangThai?.TenTrangThai;
  if (status !== 'đã lấy') return false;
  const today = dayjs().startOf('day');
  const dueDate = dayjs(borrow.NgayTra).startOf('day');
  return today.isAfter(dueDate);
};

const overdueDays = (borrow) => {
  if (!borrow.NgayTra) return 0;
  const today = dayjs().startOf('day');
  const due = dayjs(borrow.NgayTra).startOf('day');
  return today.diff(due, 'day');
};

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
    const res = await borrowBookStore.extendBorrowBook(maMuon);
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
      ElMessage.info('Hủy thao tác gia hạn.');
    }
  }
};

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
      ElMessage.info('Hủy thao tác hủy đăng ký mượn.');
    }
  }
};

const goToBookDetail = (maSach) => {
  router.push(`/book/${maSach}`);
};
</script>

<style scoped>
.borrowing-slip {
  border-width: 2px;
  border-color: black;
  border-radius: 10px;
  box-sizing: border-box;
  background-color: #7d8287ae;
  font-size: 20px;
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
  font-size: 24px;
  word-break: break-word;
}

table td {
  font-size: 20px;
}

.table thead th {
  background-color: #808385 !important;
}

.table-danger {
  background-color: #ffe5e5 !important;
}

@media (max-width: 992px) {
  .borrowing-slip {
    font-size: 18px;
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

.gia-han-note {
  font-size: 14px !important;
  font-style: italic;
  margin-bottom: 5px;
}
</style>
