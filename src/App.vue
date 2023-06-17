<script setup lang="ts">
const isOpen = ref(false)
</script>

<template>
  <!-- <main font-sans p="x-4 y-10" text="center gray-700 dark:gray-200">
    <RouterView />
    <TheFooter />
  </main> -->

  <div class="h-screen p-4 pl-18 dark:bg-dark-900 dark:text-light-100">
    <Navigation v-model="isOpen" />
    <Playground />
  </div>
</template>
