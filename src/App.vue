<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from '@/components/Client/NavBar.vue';
import NavBarAD from '@/components/Admin/NavBarAD.vue';

const route = useRoute();

const isLoginPage = computed(() => route.path === '/catalogbook');
const isAdminPage = computed(() => route.path.startsWith('/admin')); // ví dụ: /admin/dashboard

</script>

<template>
  <div id="app">
    <!-- Hiển thị navbar phù hợp -->
    <NavBarAD v-if="isAdminPage && !isLoginPage" />
    <NavBar v-else-if="!isLoginPage && !isAdminPage" />

    <router-view />
  </div>
</template>
