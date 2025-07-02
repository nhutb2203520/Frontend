<template>
    <div
        :class="['sidebar', 'bg-white', 'border-end', 'shadow-sm', 'position-fixed', 'start-0', 'overflow-auto', { 'sidebar-collapsed': !isOpen }]">
        <!-- Header Danh Mục Sách -->
        <div class="bg-primary text-white p-3 d-flex align-items-center justify-content-between cursor-pointer"
            @click="toggleSidebar">
            <div v-if="isOpen" class="d-flex align-items-center">
                <i class="bi bi-list-ul me-2 fs-5"></i>
                <h6 class="mb-0 fw-bold">DANH MỤC SÁCH</h6>
            </div>
            <div v-else class="w-100 text-center">
                <i class="bi bi-list-ul fs-4"></i>
            </div>
            <i class="bi text-white fs-4" :class="isOpen ? 'bi-chevron-left' : 'bi-chevron-right'"
                style="font-weight: bold; min-width: 20px;"></i>
        </div>

        <!-- Menu Items khi mở rộng -->
        <div v-if="isOpen" class="p-3">
            <div v-for="(section, index) in sections" :key="index" class="mb-2">
                <div class="d-flex align-items-center justify-content-between p-3 rounded cursor-pointer menu-item"
                    @click="toggleSection(index)">
                    <div class="d-flex align-items-center">
                        <i :class="[section.icon, 'me-3', 'text-primary', 'fs-5']"></i>
                        <span class="fw-medium text-dark">{{ section.label }}</span>
                    </div>
                    <div class="d-flex align-items-center">
                        <i :class="['bi', section.open ? 'bi-chevron-down' : 'bi-chevron-right', 'text-dark', 'fs-4']"
                            style="font-weight: bold;"></i>
                    </div>
                </div>
                <div v-show="section.open" class="ms-4 mt-2">
                    <Genre v-if="section.label === 'Thể loại'" :items="section.items" />
                    <Publisher v-else-if="section.label === 'Nhà xuất bản'" :items="section.items" />
                    <YearOfPublication v-else-if="section.label === 'Năm xuất bản'" :items="section.items" />
                    <Author v-else-if="section.label === 'Tác giả'" :items="section.items" />
                </div>
            </div>
        </div>

        <!-- Menu khi thu gọn -->
        <div v-else class="p-2">
            <div v-for="(section, index) in sections" :key="index"
                class="text-center p-3 mb-2 rounded cursor-pointer collapsed-item"
                :title="section.label + ' (' + section.items.length + ')'" @click="expandAndOpenSection(index)">
                <i :class="[section.icon, 'text-primary', 'fs-4', 'd-block', 'mb-1']"></i>
                <small class="text-muted d-block fw-medium" style="font-size: 0.7rem;">
                    {{ section.shortLabel }}
                </small>
            </div>
        </div>
    </div>
</template>

<script>
import Genre from '@/Views/Genre.vue';
import Publisher from '@/Views/Publisher.vue';
import YearOfPublication from '@/Views/YearOfPublication.vue';
import AuthorDetails from '@/Views/AuthorDetails.vue';

export default {
    name: 'SideBar',
    emits: ['toggle'],
    components: {
        Genre,
        Publisher,
        YearOfPublication,
        AuthorDetails
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
                    items: ['Khoa học tự nhiên', 'Công nghệ thông tin', 'Văn học nghệ thuật', 'Toán học', 'Vật lý', 'Hóa học', 'Sinh học']
                },
                {
                    label: 'Nhà xuất bản',
                    shortLabel: 'NXB',
                    icon: 'bi bi-building',
                    open: false,
                    items: ['NXB Giáo dục Việt Nam', 'NXB Kim Đồng', 'NXB Trẻ', 'NXB Lao động', 'NXB Thông tin & Truyền thông']
                },
                {
                    label: 'Năm xuất bản',
                    shortLabel: 'Năm XB',
                    icon: 'bi bi-calendar3',
                    open: false,
                    items: ['2024', '2023', '2022', '2021', '2020', '2019', '2018']
                },
                {
                    label: 'Tác giả',
                    shortLabel: 'Tác giả',
                    icon: 'bi bi-person-fill',
                    open: false,
                    items: ['Nguyễn Văn An', 'Trần Thị Bình', 'Lê Văn Cường', 'Phạm Thị Dung', 'Hoàng Minh Tuấn']
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
        }
    }
};
</script>

<style scoped>
.sidebar {
    width: 300px;
    z-index: 1060;
    top: 56px;
    height: calc(100vh - 56px);
    transition: width 0.3s ease;
}

.sidebar-collapsed {
    width: 80px;
}

.cursor-pointer {
    cursor: pointer;
}

.menu-item {
    transition: all 0.2s ease;
    border: 1px solid transparent;
}

.menu-item:hover {
    background-color: var(--bs-light) !important;
    border-color: var(--bs-primary);
    transform: translateX(2px);
}

.dropdown-item-custom {
    transition: all 0.2s ease;
    cursor: pointer;
    padding: 6px 12px;
    border-radius: 4px;
    display: flex;
    align-items: center;
}

.dropdown-item-custom:hover {
    background-color: rgba(var(--bs-primary-rgb), 0.1) !important;
    color: var(--bs-primary) !important;
}

.dropdown-item-custom:hover span {
    color: var(--bs-primary) !important;
}

.collapsed-item {
    transition: all 0.2s ease;
}

.collapsed-item:hover {
    background-color: var(--bs-light);
    transform: scale(1.05);
}

.sidebar::-webkit-scrollbar {
    width: 6px;
}

.sidebar::-webkit-scrollbar-thumb {
    background-color: var(--bs-primary);
    border-radius: 3px;
}

.sidebar::-webkit-scrollbar-track {
    background-color: var(--bs-light);
}

@media (max-width: 768px) {
    .sidebar {
        width: 280px;
    }

    .sidebar-collapsed {
        width: 70px;
    }
}

@media (max-width: 576px) {
    .sidebar {
        width: 100%;
    }

    .sidebar-collapsed {
        width: 60px;
    }
}
</style>
