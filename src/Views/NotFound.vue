<template>
  <div class="not-found-page-container">
    <div class="not-found-page d-flex flex-column justify-content-center align-items-center text-center">
      <h1 class="display-1 fw-bold text-danger">404</h1>
      <p class="lead mb-4">
        Oops, không thể tìm thấy trang.<br />
        Trở về
        <router-link class="text-primary fw-bold" to="/home">Trang chủ</router-link>.
      </p>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
.not-found-page {
  height: 80vh;
  font-size: 1.5rem;
}
</style>