<template>
  <div>
    <SessionTimer />
    <router-view />
  </div>
</template>

<style>
/* Add your global styles here */
</style>

<script lang="ts">
import SessionTimer from '@/components/sessiontimer.vue';

export default {
  name: 'App',
  components: {
    SessionTimer,
  },
};
</script>
