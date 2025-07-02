<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from '@/components/Client/NavBar.vue';

const route = useRoute();
const isLoginPage = computed(() => route?.path === '/login');
</script>

<template>
  <div id="app">
    <NavBar v-if="!isLoginPage" />
    <router-view />
  </div>
</template>
