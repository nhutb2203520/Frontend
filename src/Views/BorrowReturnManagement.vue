<template>
  <div class="overlay d-flex">
    <SideBarAD />
    <div class="flex-grow-1">
      <div class="container-fluid px-3">
        <div class="borrow-management mx-auto mt-4">
          <h1 class="title">Quản lý mượn – trả sách</h1>

          <!-- Bộ lọc -->
          <div class="top-buttons d-flex flex-wrap justify-content-center gap-3 mb-4">
            <button @click="filterByStatus('all')">Tất cả: {{ borrowList.length }}</button>
            <button @click="filterByStatus('borrowing')">Đang mượn: {{ countByStatus('borrowing') }}</button>
            <button @click="filterByStatus('pending')">Chờ duyệt: {{ countByStatus('pending') }}</button>
            <button @click="filterByStatus('overdue')">Quá hạn: {{ countByStatus('overdue') }}</button>
            <button @click="filterByStatus('returned')">Đã trả: {{ countByStatus('returned') }}</button>
          </div>

          <!-- Tìm kiếm và nhắc -->
          <div class="actions d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
            <input v-model="searchKeyword" placeholder="Tìm kiếm người mượn, sách..." />
            <button v-if="activeFilter === 'overdue' && overdueCount" class="btn btn-warning" @click="remindAll">
              📢 Nhắc tất cả ({{ overdueCount }})
            </button>
          </div>

          <!-- Danh sách phiếu mượn -->
          <div class="reader-list">
            <h3>Danh sách phiếu mượn</h3>
            <div class="scrollable-list">
              <ul>
                <li v-for="entry in filteredBorrowList" :key="entry.id" @click="selectBorrower(entry)" class="reader-item">
                  <strong>{{ entry.reader }}</strong> - "{{ entry.book }}" -
                  <span :class="'text-' + statusLabels[entry.status].color">
                    {{ statusLabels[entry.status].text }}
                  </span>

                  <!-- Chi tiết -->
                  <div v-if="selectedBorrower && selectedBorrower.id === entry.id" class="reader-detail">
                    <p><strong>Họ tên:</strong> {{ entry.reader }}</p>
                    <p><strong>Sách:</strong> {{ entry.book }}</p>
                    <p><strong>Trạng thái:</strong> {{ statusLabels[entry.status].text }}</p>
                    <p><strong>Mượn:</strong> {{ formatDate(entry.borrowDate) }}</p>
                    <p v-if="entry.dueDate"><strong>Hạn trả:</strong> {{ formatDate(entry.dueDate) }}</p>
                    <p v-if="entry.returnDate"><strong>Ngày trả:</strong> {{ formatDate(entry.returnDate) }}</p>
                    <p v-if="entry.status === 'overdue'" class="text-danger fw-bold">
                      ⚠️ Quá hạn {{ getOverdueDays(entry.dueDate) }} ngày
                    </p>
                    <div class="detail-actions">
                      <button v-if="entry.status === 'borrowing'" class="btn btn-danger btn-sm" @click.stop="returnBook(entry)">
                        Trả sách
                      </button>
                      <button v-else-if="entry.status === 'pending'" class="btn btn-success btn-sm" @click.stop="approve(entry)">
                        Duyệt mượn
                      </button>
                      <button v-else-if="entry.status === 'overdue'" class="btn btn-warning btn-sm" @click.stop="remind(entry)">
                        Nhắc nhở
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
</template>

<script>
import SideBarAD from "@/components/Admin/SideBarAD.vue";

export default {
  components: { SideBarAD },
  data() {
    return {
      searchKeyword: "",
      selectedBorrower: null,
      activeFilter: "all",
      borrowList: [
        { id: 1, reader: "Nguyễn Văn A", book: "Lập trình C++", status: "borrowing", borrowDate: "2025-06-15", dueDate: "2025-07-15" },
        { id: 2, reader: "Trần Thị B", book: "Tâm lý học", status: "pending", borrowDate: "2025-07-01" },
        { id: 3, reader: "Lê Văn C", book: "AI & Big Data", status: "overdue", borrowDate: "2025-05-20", dueDate: "2025-06-20" },
        { id: 4, reader: "Phạm Văn D", book: "JavaScript", status: "borrowing", borrowDate: "2025-06-25", dueDate: "2025-07-25" },
        { id: 5, reader: "Hoàng Thị E", book: "Python cơ bản", status: "pending", borrowDate: "2025-07-02" },
        { id: 6, reader: "Võ Văn F", book: "Java Spring Boot", status: "overdue", borrowDate: "2025-05-10", dueDate: "2025-06-10" },
      ],
      statusLabels: {
        borrowing: { text: "Đang mượn", color: "primary" },
        pending: { text: "Chờ duyệt", color: "warning" },
        overdue: { text: "Quá hạn", color: "danger" },
        returned: { text: "Đã trả", color: "success" },
      },
    };
  },
  computed: {
    filteredBorrowList() {
      let list = this.borrowList;
      if (this.activeFilter !== "all") {
        list = list.filter((e) => e.status === this.activeFilter);
      }
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase();
        list = list.filter(
          (e) =>
            e.reader.toLowerCase().includes(keyword) ||
            e.book.toLowerCase().includes(keyword)
        );
      }
      return list;
    },
    overdueCount() {
      return this.countByStatus("overdue");
    },
  },
  methods: {
    countByStatus(status) {
      return this.borrowList.filter((e) => e.status === status).length;
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString("vi-VN");
    },
    getOverdueDays(due) {
      const today = new Date();
      const diff = today - new Date(due);
      return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    },
    filterByStatus(status) {
      this.activeFilter = status;
      this.selectedBorrower = null;
    },
    selectBorrower(entry) {
      this.selectedBorrower = this.selectedBorrower?.id === entry.id ? null : entry;
    },
    approve(entry) {
      entry.status = "borrowing";
      const due = new Date();
      due.setDate(due.getDate() + 30);
      entry.dueDate = due.toISOString().split("T")[0];
      alert(`✅ Đã duyệt ${entry.reader}`);
    },
    returnBook(entry) {
      entry.status = "returned";
      entry.returnDate = new Date().toISOString().split("T")[0];
      alert(`📚 Đã trả sách: "${entry.book}" của ${entry.reader}`);
    },
    remind(entry) {
      alert(`📢 Nhắc nhở ${entry.reader}`);
    },
    remindAll() {
      const names = this.borrowList
        .filter((e) => e.status === "overdue")
        .map((e) => e.reader)
        .join(", ");
      alert(`📢 Đã nhắc ${names}`);
    },
  },
};
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
</style>
