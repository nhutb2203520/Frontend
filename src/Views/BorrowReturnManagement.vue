<template>
    <div class="overlay bg-dark bg-opacity-75 text-dark">
      <NavBarAD />
  
      <div class="container bg-white p-4 rounded shadow mt-5" style="max-width: 950px;">
        <h2 class="text-center mb-4">Quản lý mượn – trả sách</h2>
  
        <!-- Bộ lọc thống kê -->
        <div class="d-flex flex-wrap gap-2 justify-content-center mb-3">
          <button v-for="(label, key) in statusLabels" :key="key"
            class="btn fw-bold text-white"
            :class="['btn-' + label.color, activeFilter === key ? 'border border-light' : '']"
            @click="filterByStatus(key)">
            {{ label.text }}: {{ countByStatus(key) }}
          </button>
          <button class="btn btn-secondary" :class="{ active: activeFilter === 'all' }" @click="filterByStatus('all')">
            Tất cả
          </button>
        </div>
  
        <!-- Tìm kiếm + Nhắc nhở -->
        <div class="d-flex flex-column flex-md-row gap-3 mb-4 align-items-center">
          <input v-model="searchKeyword" class="form-control" placeholder="Tìm kiếm người mượn, sách..." />
          <button v-if="activeFilter === 'overdue' && overdueCount"
            class="btn btn-warning fw-bold"
            @click="remindAll">
            📢 Nhắc tất cả ({{ overdueCount }})
          </button>
        </div>
  
        <!-- Danh sách -->
        <div class="card p-3 mb-4 border">
          <h5 class="mb-3">Danh sách phiếu mượn <span v-if="activeFilter !== 'all'" class="text-primary">({{ statusLabels[activeFilter]?.text }})</span></h5>
          <ul class="list-group">
            <li v-for="entry in filteredBorrowList" :key="entry.id"
              class="list-group-item d-flex justify-content-between align-items-start flex-wrap"
              @click="selectBorrower(entry)">
              <div class="me-auto">
                <strong>{{ entry.reader }}</strong> - "{{ entry.book }}" |
                <span :class="'text-' + statusLabels[entry.status].color">{{ statusLabels[entry.status].text }}</span>
                <div class="text-muted small">
                  Mượn: {{ formatDate(entry.borrowDate) }}
                  <template v-if="entry.dueDate"> | Hạn: {{ formatDate(entry.dueDate) }}</template>
                  <span v-if="entry.status === 'overdue'" class="text-danger fw-bold"> (Quá {{ getOverdueDays(entry.dueDate) }} ngày)</span>
                </div>
              </div>
              <div>
                <button v-if="entry.status === 'pending'" class="btn btn-success btn-sm" @click.stop="approve(entry)">Duyệt</button>
                <button v-else-if="entry.status === 'overdue'" class="btn btn-warning btn-sm" @click.stop="remind(entry)">Nhắc</button>
              </div>
            </li>
          </ul>
          <div v-if="filteredBorrowList.length === 0" class="text-center text-muted mt-3 fst-italic">Không có kết quả phù hợp</div>
        </div>
  
        <!-- Thông tin người mượn -->
        <div v-if="selectedBorrower" class="alert alert-info">
          <h5>Thông tin người mượn</h5>
          <p><strong>Họ tên:</strong> {{ selectedBorrower.reader }}</p>
          <p><strong>Sách:</strong> {{ selectedBorrower.book }}</p>
          <p><strong>Trạng thái:</strong> {{ statusLabels[selectedBorrower.status].text }}</p>
          <p><strong>Mượn:</strong> {{ formatDate(selectedBorrower.borrowDate) }}</p>
          <p v-if="selectedBorrower.dueDate"><strong>Hạn trả:</strong> {{ formatDate(selectedBorrower.dueDate) }}</p>
          <p v-if="selectedBorrower.status === 'overdue'" class="alert alert-danger p-2">
            ⚠️ Quá hạn {{ getOverdueDays(selectedBorrower.dueDate) }} ngày
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import NavBarAD from "@/components/Admin/NavBarAD.vue";
  
  export default {
    components: { NavBarAD },
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
        },
      };
    },
    computed: {
      filteredBorrowList() {
        let list = this.borrowList;
        if (this.activeFilter !== "all") {
          list = list.filter(e => e.status === this.activeFilter);
        }
        if (this.searchKeyword) {
          const keyword = this.searchKeyword.toLowerCase();
          list = list.filter(e => e.reader.toLowerCase().includes(keyword) || e.book.toLowerCase().includes(keyword));
        }
        return list;
      },
      overdueCount() {
        return this.countByStatus('overdue');
      }
    },
    methods: {
      countByStatus(status) {
        return this.borrowList.filter(e => e.status === status).length;
      },
      formatDate(date) {
        return new Date(date).toLocaleDateString('vi-VN');
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
        this.selectedBorrower = entry;
      },
      approve(entry) {
        entry.status = "borrowing";
        const due = new Date();
        due.setDate(due.getDate() + 30);
        entry.dueDate = due.toISOString().split("T")[0];
        alert(`✅ Đã duyệt ${entry.reader}`);
      },
      remind(entry) {
        alert(`📢 Nhắc nhở ${entry.reader}`);
      },
      remindAll() {
        const names = this.borrowList.filter(e => e.status === "overdue").map(e => e.reader).join(", ");
        alert(`📢 Đã nhắc ${names}`);
      }
    }
  };
  </script>
  
  <style scoped>
  .overlay {
    min-height: 100vh;
    padding-top: 80px;
  }
  </style>
  