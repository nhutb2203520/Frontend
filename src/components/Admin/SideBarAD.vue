<template>
  <div>
    <!-- SIDEBAR DESKTOP -->
    <div
      :class="[
        'sidebar bg-white border-end shadow-sm position-fixed start-0 overflow-auto d-none d-md-block',
        { 'sidebar-collapsed': !isOpen }
      ]"
    >
      <!-- Toggle -->
      <div
        class="bg-primary text-white p-3 d-flex align-items-center justify-content-between cursor-pointer"
        @click="toggleSidebar"
      >
        <div v-if="isOpen" class="d-flex align-items-center">
          <i class="bi bi-list-ul me-2 fs-5"></i>
          <h6 class="mb-0 fw-bold">QUẢN LÝ</h6>
        </div>
        <div v-else class="w-100 text-center">
          <i class="bi bi-list-ul fs-4"></i>
        </div>
        <i class="bi text-white fs-4" :class="isOpen ? 'bi-chevron-left' : 'bi-chevron-right'"></i>
      </div>

      <!-- Nội dung mở -->
      <div v-if="isOpen" class="p-3">
        <div v-for="(item, index) in menuItems" :key="index" class="mb-2">
          <router-link
            :to="item.route"
            :class="[
              'd-flex justify-content-between align-items-center p-2 rounded cursor-pointer border hover-shadow text-decoration-none',
              { 'fw-bold bg-light border-primary': route.path === item.route }
            ]"
          >
            <div class="d-flex align-items-center">
              <i :class="[item.icon, 'me-2', 'text-primary']"></i>
              <span class="text-dark">{{ item.label }}</span>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Nội dung thu gọn -->
      <div v-else class="p-2 text-center">
        <div
          v-for="(item, index) in menuItems"
          :key="index"
          class="collapsed-item p-3 mb-2 rounded cursor-pointer"
          :title="item.label"
          @click="navigateTo(item.route)"
          :class="{ 'bg-light border-primary fw-bold': route.path === item.route }"
        >
          <i :class="[item.icon, 'text-primary', 'fs-4', 'mb-1']"></i>
          <small class="text-muted fw-medium" style="font-size: 0.7rem;">{{ item.shortLabel }}</small>
        </div>
      </div>
    </div>

    <!-- SIDEBAR MOBILE -->
    <div class="d-md-none">
      <!-- Nút menu luôn hiển thị -->
      <button
        class="btn btn-primary m-2 position-fixed top-0 start-0 z-1035"
        @click="showMobileSidebar = true"
      >
        <i class="bi bi-list"></i>
      </button>

      <div class="mobile-sidebar-wrapper" v-show="showMobileSidebar">
        <div class="backdrop" @click.self="showMobileSidebar = false"></div>
        <div class="mobile-sidebar bg-white shadow">
          <div
            class="offcanvas-header bg-primary text-white p-3 d-flex justify-content-between"
          >
            <h6 class="mb-0">Menu</h6>
            <button class="btn-close btn-close-white" @click="showMobileSidebar = false"></button>
          </div>
          <div class="offcanvas-body p-3">
            <div v-for="(item, index) in menuItems" :key="index" class="mb-3">
              <router-link
                :to="item.route"
                :class="[
                  'd-flex align-items-center p-2 rounded border hover-shadow text-decoration-none',
                  { 'fw-bold bg-light border-primary': route.path === item.route }
                ]"
                @click="showMobileSidebar = false"
              >
                <i :class="[item.icon, 'me-2', 'text-primary']"></i>
                <span class="text-dark">{{ item.label }}</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const emit = defineEmits(['toggle']);
const router = useRouter();
const route = useRoute(); // ✅ Để kiểm tra đường dẫn hiện tại

const isOpen = ref(true);
const showMobileSidebar = ref(false);

const menuItems = [
  {
    label: 'Quản lý mượn/trả sách',
    shortLabel: 'Mượn trả',
    icon: 'bi bi-journal-bookmark-fill',
    route: '/admin/borrow-return-management',
  },
  {
    label: 'Quản lý loại sách',
    shortLabel: 'Loại sách',
    icon: 'bi bi-tags-fill',
    route: '/admin/category-management',
  },
  {
    label: 'Quản lý độc giả',
    shortLabel: 'Độc giả',
    icon: 'bi bi-people-fill',
    route: '/admin/management-reader',
  },
  {
    label: 'Quản lý sách',
    shortLabel: 'Sách',
    icon: 'bi bi-book-half',
    route: '/admin/book-management',
  },
  {
    label: 'Quản lý NXB',
    shortLabel: 'NXB',
    icon: 'bi bi-buildings',
    route: '/admin/management-publisher',
  },
];

function toggleSidebar() {
  isOpen.value = !isOpen.value;
  emit('toggle', isOpen.value);
}

function navigateTo(route) {
  isOpen.value = true;
  emit('toggle', isOpen.value);
  router.push(route);
}
</script>

<style scoped>
.sidebar {
  width: 260px;
  top: 70px;
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

/* MOBILE SIDEBAR */
.mobile-sidebar-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1050;
  width: 100vw;
  height: 100vh;
}
.backdrop {
  background: rgba(0, 0, 0, 0.4);
  width: 100%;
  height: 100%;
}
.mobile-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 260px;
  height: 100vh;
  background: white;
  z-index: 1051;
  overflow-y: auto;
  transition: transform 0.3s ease;
}
</style>
