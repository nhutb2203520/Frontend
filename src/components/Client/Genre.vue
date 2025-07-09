<template>
    <div>
        <div v-for="(item, i) in items" :key="i"
            class="d-flex align-items-center p-2 ps-3 rounded mb-1 dropdown-item-custom" @click="handleClick(item)">
            <i class="bi bi-dot text-primary me-2 fs-4"></i>
            <span class="text-secondary">{{ item }}</span>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Genre',
    props: {
        items: {
            type: Array,
            required: true
        }
    },
    emits: ['genre-selected'],
    methods: {
        handleClick(item) {
            this.$emit('genre-selected', item);
            console.log(`Thể loại được chọn ở con genre: ${item}`);
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
}

.dropdown-item-custom:hover span {
    color: var(--bs-primary) !important;
}
</style>
