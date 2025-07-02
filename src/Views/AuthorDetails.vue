<template>
    <div class="container mt-4">
        <h3 class="mb-3">Chi tiết tác giả: {{ authorName }}</h3>
        <!-- Hiển thị thông tin chi tiết tác giả ở đây -->
        <p>Bạn có thể hiển thị thông tin về tác giả {{ authorName }} tại đây...</p>
    </div>
</template>

<script>
export default {
    name: 'AuthorDetails',
    computed: {
        authorName() {
            return this.$route.params.name;
        }
    }
};
</script>
