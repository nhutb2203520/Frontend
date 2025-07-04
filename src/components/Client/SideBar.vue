<template>
    <div :class="['sidebar bg-white border-end shadow-sm position-fixed start-0 overflow-auto', { 'sidebar-collapsed': !isOpen }]">
      <!-- Header -->
      <div class="bg-primary text-white p-3 d-flex align-items-center justify-content-between cursor-pointer"
           @click="toggleSidebar">
        <div v-if="isOpen" class="d-flex align-items-center">
          <i class="bi bi-list-ul me-2 fs-5"></i>
          <h6 class="mb-0 fw-bold">DANH MỤC SÁCH</h6>
        </div>
        <div v-else class="w-100 text-center">
          <i class="bi bi-list-ul fs-4"></i>
        </div>
        <i class="bi text-white fs-4" :class="isOpen ? 'bi-chevron-left' : 'bi-chevron-right'"></i>
      </div>
  
      <!-- Sidebar mở rộng -->
      <div v-if="isOpen" class="p-3">
        <div v-for="(section, index) in sections" :key="index" class="mb-2">
          <!-- Mục chính -->
          <div class="d-flex justify-content-between align-items-center p-2 rounded cursor-pointer border hover-shadow"
               @click="toggleSection(index)">
            <div class="d-flex align-items-center">
              <i :class="[section.icon, 'me-2', 'text-primary']"></i>
              <span>{{ section.label }}</span>
            </div>
            <i :class="['bi', section.open ? 'bi-chevron-down' : 'bi-chevron-right']"></i>
          </div>
  
          <!-- Nội dung con -->
          <div v-show="section.open" class="mt-2 ms-4">
            <component :is="getComponent(section.label)" :items="section.items" />
          </div>
        </div>
      </div>
  
      <!-- Sidebar rút gọn -->
      <div v-else class="p-2 text-center">
        <div v-for="(section, index) in sections" :key="index"
             class="collapsed-item p-3 mb-2 rounded cursor-pointer"
             :title="`${section.label} (${section.items.length})`"
             @click="expandAndOpenSection(index)">
          <i :class="[section.icon, 'text-primary', 'fs-4', 'mb-1']"></i>
          <small class="text-muted fw-medium" style="font-size: 0.7rem;">{{ section.shortLabel }}</small>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Genre from './Genre.vue';'@/components/Client/Genre.vuews/Genre.vue';
  import Publisher from '@/components/Client/Publisher.vue';
  import YearOfPublication from '@/components/Client/YearOfPublication.vue';
  import AuthorDetails from '@/components/Client/AuthorDetails.vue'; // ✅ Đúng tên component
  
  export default {
    name: 'SideBar',
    emits: ['toggle'],
    components: {
      Genre,
      Publisher,
      YearOfPublication,
      AuthorDetails // ✅ Component này cần dùng đúng tên
    },
    data() {
      return {
        isOpen: true,
        sections: [
          {
            label: 'Thể loại',
            shortLabel: 'Thể loại',
            icon: 'bi bi-tags-fill',
            open: false,
            items: ['Khoa học tự nhiên', 'Công nghệ thông tin', 'Văn học nghệ thuật', 'Toán học']
          },
          {
            label: 'Nhà xuất bản',
            shortLabel: 'NXB',
            icon: 'bi bi-building',
            open: false,
            items: ['NXB Giáo dục', 'NXB Kim Đồng', 'NXB Trẻ']
          },
          {
            label: 'Năm xuất bản',
            shortLabel: 'Năm XB',
            icon: 'bi bi-calendar3',
            open: false,
            items: ['2024', '2023', '2022']
          },
          {
            label: 'Tác giả',
            shortLabel: 'Tác giả',
            icon: 'bi bi-person-fill',
            open: false,
            items: ['Nguyễn Văn An', 'Trần Thị Bình']
          }
        ]
      };
    },
    methods: {
      toggleSection(index) {
        this.sections[index].open = !this.sections[index].open;
      },
      toggleSidebar() {
        this.isOpen = !this.isOpen;
        this.$emit('toggle', this.isOpen);
      },
      expandAndOpenSection(index) {
        this.isOpen = true;
        this.$nextTick(() => {
          this.sections[index].open = true;
        });
        this.$emit('toggle', this.isOpen);
      },
      getComponent(label) {
        switch (label) {
          case 'Thể loại': return 'Genre';
          case 'Nhà xuất bản': return 'Publisher';
          case 'Năm xuất bản': return 'YearOfPublication';
          case 'Tác giả': return 'AuthorDetails'; // ✅ Đúng tên component đã import
          default: return null;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .sidebar {
    width: 260px;
    top: 56px;
    height: calc(100vh - 56px);
    transition: width 0.3s ease;
    z-index: 1060;
  }
  .sidebar-collapsed {
    width: 80px;
  }
  .cursor-pointer {
    cursor: pointer;
  }
  .hover-shadow:hover {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  }
  .collapsed-item:hover {
    background-color: var(--bs-light);
    transform: scale(1.05);
    transition: all 0.2s ease;
  }
  .sidebar::-webkit-scrollbar {
    width: 6px;
  }
  .sidebar::-webkit-scrollbar-thumb {
    background-color: var(--bs-primary);
    border-radius: 3px;
  }
  </style>
  