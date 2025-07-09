<template>
    <div>
        <div v-for="(item, i) in items" :key="i"
            class="d-flex align-items-center p-2 ps-3 rounded mb-1 dropdown-item-custom"
            :class="{ active: selected === item }" @click="handleClick(item)">
            <i class="bi bi-dot text-primary me-2 fs-4"></i>
            <span :class="selected === item ? 'text-white' : 'text-secondary'">{{ item }}</span>
        </div>
    </div>
</template>


<script>
export default {
    name: 'Publisher',
    props: {
        items: {
            type: Array,
            required: true
        },
        selected: {
            type: String,
            default: null
        }
    },
    emits: ['publisher-selected'],
    methods: {
        handleClick(item) {
            this.$emit('publisher-selected', item);
            console.log('Nhà xuất bản được chọn ở publisher:', item);
        }
    }
};
</script>

<style scoped>
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
    transform: translateX(2px);
}

.dropdown-item-custom:hover span {
    color: var(--bs-primary) !important;
    font-weight: 500;
}

.active {
    background-color: var(--bs-primary) !important;
    color: white !important;
}

.active span {
    color: white !important;
    font-weight: 500;
}
</style>
