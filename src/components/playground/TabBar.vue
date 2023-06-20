<script setup lang="ts">
import { ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import { orchestrator } from '~/orchestrator'

const isAddingTab = ref(false)
const filename = ref('')

useEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    isAddingTab.value = false
    filename.value = ''
  }
})
</script>

<template>
  <div class="flex-shrink-0 bg-light-500 h-8 overflow-hidden border-light-900 dark:border-dark-400 border-1 dark:bg-dark-800 rounded-t-md border-b flex flex-row items-center pr-2">
    <Tab
      v-for="file in orchestrator.files"
      :key="file.filename"
      :active="file.filename === orchestrator.activeFilename"
      :name="file.filename"
    >
      {{ file.filename }}
    </Tab>

    <!-- <svg class="text-base text-black dark:text-white" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M11 3v18H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h7Zm10 10v7a1 1 0 0 1-1 1h-7v-8h8ZM20 3a1 1 0 0 1 1 1v7h-8V3h7Z" /></svg> -->
  </div>
</template>
