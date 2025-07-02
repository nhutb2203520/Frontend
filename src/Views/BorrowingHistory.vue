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
                    <tr v-for="(book, index) in borrowDetails" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>
                            <strong>{{ book.title }}</strong><br />
                            <em>Tác giả: {{ book.author }}</em>
                        </td>
                        <td>{{ book.borrowDate }}</td>
                        <td>{{ book.returnDate }}</td>
                        <td>{{ book.status }}</td> <!-- Cột bị thiếu đã thêm vào -->
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BookBorrowingSlip',
    data() {
        return {
            borrowDetails: [
                {
                    title: 'Giáo trình Vue.js cơ bản',
                    author: 'Nguyễn Văn A',
                    borrowDate: '2025-07-01',
                    returnDate: '2025-07-06',
                    status: 'Đang mượn'
                },
                {
                    title: 'Node.js nâng cao',
                    author: 'Trần Thị B',
                    borrowDate: '2025-07-01',
                    returnDate: '2025-07-06',
                    status: 'Đã trả'
                }
            ]
        };
    }
};
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
