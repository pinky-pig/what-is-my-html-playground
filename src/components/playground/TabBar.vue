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

function handleRunOnce() {
  isRunOnce.value = (isRunOnce.value + 1) % 10
}
</script>

<template>
  <div class=" flex-shrink-0 bg-light-500 h-8 overflow-hidden border-light-900 dark:border-dark-400 border-1 dark:bg-dark-800 rounded-t-md border-b flex flex-row items-center justify-between pr-2">
    <div>
      <Tab
        v-for="file in orchestrator.files"
        :key="file.filename"
        :active="file.filename === orchestrator.activeFilename"
        :name="file.filename"
      >
        {{ file.filename }}
      </Tab>
    </div>

    <div
      v-if="!isImmediateRun"
      class="text-green-900 hover:text-green-500 hover:scale-120 transition-all ease-in-out duration-200 "
      cursor="pointer"
      i-carbon:caret-right
      @click="handleRunOnce"
    />
  </div>
</template>
