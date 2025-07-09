<template>
  <div class="borrowing-slip container my-5 p-4 border rounded">
    <div class="header text-center border-bottom pb-2 mb-4">
      <h2 class="fst-italic">LỊCH SỬ MƯỢN SÁCH</h2>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue';
  import { useBorrowBookStore } from '@/Store/BorrowBook.store';
  import { capitalizeWords } from '@/utils/stringUtils';
  import { formatDate } from '@/utils/formatDate';
  
  const borrowDetails = ref([]);
  
  onMounted(async () => {
    const borrowBookStore = useBorrowBookStore();
    borrowDetails.value = await borrowBookStore.fetchBorrowBooks();
  });
  
  // Các hành động
  function extendBorrow(borrow) {
    alert(`📚 Gia hạn sách: ${borrow.MaSach?.TenSach}`);
    // Thực tế gọi API ở đây
  }
  
  function cancelBorrow(borrow) {
    alert(`❌ Huỷ mượn sách: ${borrow.MaSach?.TenSach}`);
    // Thực tế gọi API ở đây
  }
  
  function borrowAgain(borrow) {
    alert(`🔁 Mượn lại sách: ${borrow.MaSach?.TenSach}`);
    // Thực tế gọi API ở đây
  }
  </script>
  
<style scoped>
  .borrowing-slip {
  border-width: 2px;
  border-color: black;
  border-radius: 10px;
  box-sizing: border-box;
  background-color: #7d8287ae;
  font-size: 20px; /* Giảm cỡ chữ toàn bộ */
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
  white-space: normal; /* Cho phép xuống dòng */
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
  

