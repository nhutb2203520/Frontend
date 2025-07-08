<template>
  <div
    :class="['sidebar bg-white border-end shadow-sm position-fixed start-0 overflow-auto', { 'sidebar-collapsed': !isOpen }]">
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
        <div class="d-flex justify-content-between align-items-center p-2 rounded cursor-pointer border hover-shadow"
          @click="toggleSection(index)">
          <div class="d-flex align-items-center">
            <i :class="[section.icon, 'me-2', 'text-primary']"></i>
            <span>{{ section.label }}</span>
          </div>
          <i :class="['bi', section.open ? 'bi-chevron-down' : 'bi-chevron-right']"></i>
        </div>
        <div v-show="section.open" class="mt-2 ms-4">
          <component :is="getComponent(section.label)" :items="section.items" />
        </div>
      </div>
    </div>

    <!-- Sidebar rút gọn -->
    <div v-else class="p-2 text-center">
      <div v-for="(section, index) in sections" :key="index" class="collapsed-item p-3 mb-2 rounded cursor-pointer"
        :title="`${section.label} (${section.items.length})`" @click="expandAndOpenSection(index)">
        <i :class="[section.icon, 'text-primary', 'fs-4', 'mb-1']"></i>
        <small class="text-muted fw-medium" style="font-size: 0.7rem;">{{ section.shortLabel }}</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Genre from '@/components/Client/Genre.vue';
import Publisher from '@/components/Client/Publisher.vue';
import YearOfPublication from '@/components/Client/YearOfPublication.vue';
import AuthorDetails from '@/components/Client/AuthorDetails.vue';
import { useCategoryBookStore } from '@/Store/category.store';
import { usePublisherStore } from '@/Store/publisher.store';
import { useAuthorStore } from '@/Store/author.store'
import { useBookStore } from '@/Store/Book.store';
import { capitalizeWords } from '../../utils/stringUtils'
const emit = defineEmits(['toggle']);

const isOpen = ref(true);

const sections = ref([
  {
    label: 'Thể loại',
    shortLabel: 'Thể loại',
    icon: 'bi bi-tags-fill',
    open: false,
    items: [] // sẽ được gán khi mounted
  },
  {
    label: 'Nhà xuất bản',
    shortLabel: 'NXB',
    icon: 'bi bi-building',
    open: false,
    items: [] // sẽ được gán khi mounted
  },
  {
    label: 'Năm xuất bản',
    shortLabel: 'Năm XB',
    icon: 'bi bi-calendar3',
    open: false,
    items: [] // sẽ được gán khi mounted
  },
  {
    label: 'Tác giả',
    shortLabel: 'Tác giả',
    icon: 'bi bi-person-fill',
    open: false,
    items: []
  }
]);

const toggleSection = (index) => {
  sections.value[index].open = !sections.value[index].open;
};

const toggleSidebar = () => {
  isOpen.value = !isOpen.value;
  emit('toggle', isOpen.value);
};

const expandAndOpenSection = (index) => {
  isOpen.value = true;
  nextTick(() => {
    sections.value[index].open = true;
  });
  emit('toggle', isOpen.value);
};

const getComponent = (label) => {
  switch (label) {
    case 'Thể loại': return Genre;
    case 'Nhà xuất bản': return Publisher;
    case 'Năm xuất bản': return YearOfPublication;
    case 'Tác giả': return AuthorDetails;
    default: return null;
  }
};

onMounted(async () => {
  const categoryStore = useCategoryBookStore();
  const categories = await categoryStore.fetchCategoryBooks();
  const categoryNames = categories.map(cat => cat.TenLoai);
  sections.value[0].items = categoryNames.map(name => capitalizeWords(name)) || [];

  const publisherStore = usePublisherStore();
  const publishers = await publisherStore.fetchPublishers();
  const publisherNames = publishers.map(pub => pub.TenNXB);
  sections.value[1].items = publisherNames.map(name => capitalizeWords(name)) || [];

  const bookStore = useBookStore();
  const books = await bookStore.fetchBooks(); // Gọi API lấy sách
  const years = books
    .map(book => parseInt(book.NamXuatBan, 10))
    .filter(year => !isNaN(year));
  const minYear = Math.min(...years);
  const currentYear = new Date().getFullYear();
  // Tạo danh sách từ năm nhỏ nhất đến hiện tại
  const yearList = [];
  for (let y = currentYear; y >= minYear; y--) {
    yearList.push(String(y)); // ép sang string để giống dữ liệu cũ
  }
  sections.value[2].items = yearList;

  const authorStore = useAuthorStore();
  const authors = await authorStore.fetchAuthors();
  const authorNames = authors.map(author => author.TenTG);
  sections.value[3].items = authorNames.map(name => capitalizeWords(name)) || [];
});
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
