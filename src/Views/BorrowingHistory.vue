<template>
    <div class="borrowing-slip container my-5 p-4 border rounded">
        <div class="header text-center border-bottom pb-2 mb-4">
            <h2 class="fst-italic">LỊCH SỬ MƯỢN SÁCH</h2>
        </div>

        <div class="body">
            <table class="table table-bordered text-center">
                <thead class="table-light">
                    <tr>
                        <th>STT</th>
                        <th>Thông tin sách</th>
                        <th>Ngày mượn</th>
                        <th>Ngày đến hạn trả</th>
                        <th>Trạng thái sách</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(borrow, index) in borrowDetails" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>
                            <strong>{{ capitalizeWords(borrow.MaSach?.TenSach) }}</strong><br />
                            <em>Tác giả: {{capitalizeWords(borrow.MaSach?.TacGia?.map(tg => tg.TenTG).join(', '))
                                }}</em>
                        </td>
                        <td>{{ formatDate(borrow.NgayMuon) }}</td>
                        <td>{{ formatDate(borrow.NgayTra) }}</td>
                        <td>{{ capitalizeWords(borrow.MaTrangThai?.TenTrangThai) }}</td>
                        <!-- Cột bị thiếu đã thêm vào -->
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useBorrowBookStore } from '@/Store/BorrowBook.store';
const borrowDetails = ref([]);
onMounted(async () => {
    const borrowBookStore = useBorrowBookStore();
    borrowDetails.value = await borrowBookStore.fetchBorrowBooks();
    console.log(borrowDetails.value);
});
function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
}
function capitalizeWords(str) {
    return str
        .toLowerCase()
        .split(' ')
        .filter(word => word.trim() !== "")
        .map(word => word[0].toUpperCase() + word.slice(1))
        .join(' ');
}


</script>

<style scoped>
.borrowing-slip {
    border-width: 2px;
    border-color: black;
    border-radius: 10px;
    box-sizing: border-box;
    background-color: #7d8287ae;
    font-size: 30px;
}

/* Đường viền header */
.header {
    border-bottom: 2px solid black;
}

/* Đảm bảo bảng chiếm hết chiều ngang và đường viền đồng đều */
table {
    width: 100%;
    border-collapse: collapse;
}

table th,
table td {
    vertical-align: middle;
    border: 1px solid black;
    /* Đảm bảo đường viền bao quanh các ô */
}

/* Tô nhẹ header */
.table thead th {
    background-color: #808385;
}
</style>
