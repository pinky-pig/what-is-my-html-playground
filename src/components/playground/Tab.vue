<script setup lang="ts">
import { computed } from 'vue'
import { orchestrator, setActiveFile } from '~/orchestrator'

const props = defineProps<{
  name: string
  active: boolean
}>()

const isActive = computed(() => orchestrator.activeFilename === props.name)
</script>

<template>
  <div
    :class="{ '!pr-4': name === 'html', 'dark:bg-dark-600 light-800': isActive }"
    p="l-4 r-2"
    cursor="pointer"
    bg="hover:(light-800 dark:dark-600)"
    text="sm"
    h="8"
    display="inline-flex"
    flex="row"
    place="items-center"
    space="x-2"
    select="none"
    border="r-1 light-900 dark:dark-400"
    @click="setActiveFile(name)"
  >
    <!-- html -->
    <div
      :class="{ '!text-green-500': active }"
    >
      <svg v-if="name === 'html'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="m12 17.56l4.07-1.13l.55-6.1H9.38L9.2 8.3h7.6l.2-1.99H7l.56 6.01h6.89l-.23 2.58l-2.22.6l-2.22-.6l-.14-1.66h-2l.29 3.19L12 17.56M4.07 3h15.86L18.5 19.2L12 21l-6.5-1.8L4.07 3Z" /></svg>
      <!-- css -->
      <svg v-if="name === 'css'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="m5 3l-.65 3.34h13.59L17.5 8.5H3.92l-.66 3.33h13.59l-.76 3.81l-5.48 1.81l-4.75-1.81l.33-1.64H2.85l-.79 4l7.85 3l9.05-3l1.2-6.03l.24-1.21L21.94 3H5Z" /></svg>
      <!-- javascript -->
      <svg v-if="name === 'javascript'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M3 3h18v18H3V3m4.73 15.04c.4.85 1.19 1.55 2.54 1.55c1.5 0 2.53-.8 2.53-2.55v-5.78h-1.7V17c0 .86-.35 1.08-.9 1.08c-.58 0-.82-.4-1.09-.87l-1.38.83m5.98-.18c.5.98 1.51 1.73 3.09 1.73c1.6 0 2.8-.83 2.8-2.36c0-1.41-.81-2.04-2.25-2.66l-.42-.18c-.73-.31-1.04-.52-1.04-1.02c0-.41.31-.73.81-.73c.48 0 .8.21 1.09.73l1.31-.87c-.55-.96-1.33-1.33-2.4-1.33c-1.51 0-2.48.96-2.48 2.23c0 1.38.81 2.03 2.03 2.55l.42.18c.78.34 1.24.55 1.24 1.13c0 .48-.45.83-1.15.83c-.83 0-1.31-.43-1.67-1.03l-1.38.8Z" /></svg>
    </div>
    <div
      :class="{ '!text-green-500': active }"
      text="dark-900 dark:light-900 xs"
    >
      <slot />
    </div>
    <!-- <Button icon p="0" small>
      <div i-carbon-chevron-down />
    </Button> -->
  </div>
</template>
