<template>
    <div :class="['sidebar bg-white border-end shadow-sm position-fixed start-0 overflow-auto', { 'sidebar-collapsed': !isOpen }]">
      <!-- Header -->
      <div class="bg-primary text-white p-3 d-flex align-items-center justify-content-between cursor-pointer"
           @click="toggleSidebar">
        <div v-if="isOpen" class="d-flex align-items-center">
          <i class="bi bi-list-ul me-2 fs-5"></i>
          <h6 class="mb-0 fw-bold">QUẢN LÝ</h6>
        </div>
        <div v-else class="w-100 text-center">
          <i class="bi bi-list-ul fs-4"></i>
        </div>
        <i class="bi text-white fs-4" :class="isOpen ? 'bi-chevron-left' : 'bi-chevron-right'"></i>
      </div>
  
      <!-- Sidebar mở -->
      <div v-if="isOpen" class="p-3">
        <div v-for="(item, index) in menuItems" :key="index" class="mb-2">
          <router-link
            :to="item.route"
            class="d-flex justify-content-between align-items-center p-2 rounded cursor-pointer border hover-shadow text-decoration-none"
          >
            <div class="d-flex align-items-center">
              <i :class="[item.icon, 'me-2', 'text-primary']"></i>
              <span class="text-dark">{{ item.label }}</span>
            </div>
          </router-link>
        </div>
      </div>
  
      <!-- Sidebar thu gọn -->
      <div v-else class="p-2 text-center">
        <div v-for="(item, index) in menuItems" :key="index"
             class="collapsed-item p-3 mb-2 rounded cursor-pointer"
             :title="item.label"
             @click="navigateTo(item.route)">
          <i :class="[item.icon, 'text-primary', 'fs-4', 'mb-1']"></i>
          <small class="text-muted fw-medium" style="font-size: 0.7rem;">{{ item.shortLabel }}</small>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import { ref } from 'vue';

  const emit = defineEmits(['toggle']);
  const router = useRouter();
  const isOpen = ref(true);
  
  const menuItems = [
    { label: 'Quản lý mượn/trả sách', shortLabel: 'Mượn trả', icon: 'bi bi-journal-bookmark-fill', route: 'borrow-return-management' },
    { label: 'Quản lý loại sách', shortLabel: 'Loại sách', icon: 'bi bi-tags-fill', route: 'category-management' },
    { label: 'Quản lý độc giả', shortLabel: 'Độc giả', icon: 'bi bi-people-fill', route: 'management-reader' },
    { label: 'Quản lý sách', shortLabel: 'Sách', icon: 'bi bi-book-half', route: 'book-management' },
    { label: 'Quản lý NXB', shortLabel: 'NXB', icon: 'bi bi-buildings', route: 'management-publisher' }
  ];
  
  function toggleSidebar() {
    isOpen.value = !isOpen.value;
    emit('toggle', isOpen.value); // ✅ Gửi tín hiệu toggle ra ngoài
  }
  
  function navigateTo(route) {
    isOpen.value = true;
    emit('toggle', isOpen.value); // ✅ Khi mở lại sidebar, đẩy nội dung qua
    router.push(route);
  }
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
  