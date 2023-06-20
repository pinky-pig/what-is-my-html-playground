<script setup lang="ts">
defineProps<{
  message: string
  type: 'error' | 'log' | 'warn'
}>()

const styles = {
  error: 'bg-red-500 text-red-900',
  log: ' bg-gray-200 text-gray-500',
  warn: 'bg-yellow-200 text-yellow-500 ',
}
</script>

<template>
  <div class="flex flex-row items-center px-2 py-2 space-x-2 border-b dark:border-dark-400 font-mono">
    <div
      :class="styles[type]"
      class="text-xs px-1 py-[3px] flex items-center font-bold rounded"
    >
      {{ type.toUpperCase() }}
    </div>
    <span class="text-sm dark:(text-light-900 text-opacity-50)">
      {{ message }}
    </span>
  </div>
</template>
