<template>
  <div class="overlay d-flex">
    <SideBarAD />
    <div class="flex-grow-1">

      <div class="container-fluid px-3">
        <!-- Router View sẽ hiển thị form thêm độc giả nếu được định tuyến -->
        <router-view />

        <!-- Danh sách độc giả chỉ hiển thị khi route là ManagementReader -->
        <div v-if="$route.name === 'ManagementReader'" class="reader-management mx-auto mt-4">
          <h1 class="title">Quản lý độc giả</h1>

          <div class="top-buttons d-flex flex-wrap justify-content-center gap-3 mb-4">
            <button @click="filterAll">Tổng độc giả: {{ totalReaders }}</button>
            <button @click="filterActive">Hoạt động: {{ activeReaders }}</button>
            <button @click="filterBlocked">Bị khóa: {{ blockedReaders }}</button>
          </div>

          <div class="actions d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
            <input v-model="searchKeyword" placeholder="Tìm kiếm theo tên hoặc email..." />
          </div>

          <div class="reader-list">
            <h3 class="text-center">Danh sách độc giả</h3>
            <div class="scrollable-list">
              <ul>
                <li v-for="reader in filteredReaders" :key="reader._id" @click="toggleReader(reader)"
                  class="reader-item">
                  <strong>{{ capitalizeWords(reader.HoTen) }}</strong> - {{ reader.Email }} -
                  <span :class="reader.MaTT?.TenTT === 'active' ? 'text-success' : 'text-danger'">
                    {{ reader.MaTT?.TenTT === 'active' ? 'Hoạt động' : 'Bị khóa' }}
                  </span>

                  <div v-if="selectedReader?._id === reader._id" class="reader-detail">
                    <p><strong><el-icon>
                          <UserFilled />
                        </el-icon>Họ Tên:</strong> {{ capitalizeWords(reader.HoTen) }}</p>
                    <p><strong><el-icon>
                          <Message />
                        </el-icon>Email:</strong> {{ reader.Email }}</p>

                    <p><strong><el-icon>
                          <Calendar />
                        </el-icon>Ngày Tạo tài khoản:</strong> {{ formatDate(reader.createdAt) }}</p>
                    <strong>Trạng thái:</strong>
                    <span :class="reader.MaTT?.TenTT === 'active' ? 'text-success' : 'text-danger'">
                      {{ reader.MaTT?.TenTT === 'active' ? 'Hoạt động' : 'Bị khóa' }}
                    </span>

                    <button class="btn" :class="reader.MaTT?.TenTT === 'active' ? 'btn-danger' : 'btn-success'"
                      @click.stop="toggleStatus(reader)">
                      {{ reader.MaTT?.TenTT === 'active' ? '🔒 Khóa' : '🔓 Mở khóa' }}
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SideBarAD from '@/components/Admin/SideBarAD.vue';
import { useReaderStore } from '@/Store/Reader.store';
import { capitalizeWords } from '@/utils/stringUtils'
import { formatDate } from '@/utils/formatDate';
import { ElMessage } from 'element-plus';
export default {
  components: { SideBarAD },
  data() {
    return {
      searchKeyword: "",
      filterType: "all",
      selectedReader: null,
      readers: []
    };
  },
  computed: {
    totalReaders() {
      return this.readers.length;
    },
    activeReaders() {
      return this.readers.filter(r => r.MaTT.TenTT === "active").length;
    },
    blockedReaders() {
      return this.readers.filter(r => r.MaTT.TenTT === "blocked").length;
    },
    filteredReaders() {
      return this.readers
        .filter(r => {
          if (this.filterType === 'active') return r.MaTT.TenTT === 'active';
          if (this.filterType === 'blocked') return r.MaTT.TenTT === 'blocked';
          return true;
        })
        .filter(r =>
          r.HoTen.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
          r.Email.toLowerCase().includes(this.searchKeyword.toLowerCase())
        );
    }
  },
  methods: {
    formatDate,
    capitalizeWords,
    filterAll() {
      this.filterType = 'all';
      this.selectedReader = null;
    },
    filterActive() {
      this.filterType = 'active';
      this.selectedReader = null;
    },
    filterBlocked() {
      this.filterType = 'blocked';
      this.selectedReader = null;
    },
    toggleReader(reader) {
      this.selectedReader = this.selectedReader?._id === reader._id ? null : reader;
    },
    async toggleStatus(reader) {
      const newStatus = reader.MaTT.TenTT === 'active' ? 'blocked' : 'active';
      const data = {
        _id: reader._id,
        TrangThai: newStatus
      }
      try {
        const res = await useReaderStore().updateStatus(data)
        if (res.message === 'Cập nhật trạng thái tài khoản độc giả thành công.') {
          ElMessage.success('Cập nhật trạng thái độc giả thành công.')
          this.readers = await useReaderStore().fetchReaders()
          this.selectedReader = null
        } else {
          ElMessage.error(res.message)
        }
      } catch (err) {
        this.$message.error(`Cập nhật thất bại: ${err}`)
      }
    }
  },
  async mounted() {
    this.readers = await useReaderStore().fetchReaders()
  }
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

.reader-management {
  margin-top: 105px !important;
  width: 65%;
  max-width: 65%;
  background: #fff;
  padding: 30px;
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

.add-btn {
  padding: 12px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  transition: 0.3s;
  cursor: pointer;
}

.add-btn:hover {
  background-color: #2980b9;
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

.text-success {
  color: #28a745;
}

.text-danger {
  color: #dc3545;
}

@media (max-width: 768px) {
  .reader-management {
    width: 95% !important;
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
  .add-btn {
    width: 100% !important;
  }
}
</style>