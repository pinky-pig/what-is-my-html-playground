<script setup lang="ts">
const props = defineProps<{ modelValue: boolean }>()
const isOpen = useVModel(props)
</script>

<template>
  <div
    position="fixed left-0 top-0 bottom-0"
    p="y-4 x-2"
    w="18"
    flex="~ col"
    items="center"
    spcae="y-2"
  >
    <img src="/arvin.svg" class="w-12">
    <span class="flex-1" />
    <Button
      icon
      text="base"
      @click="toggleDark()"
    >
      <div i-carbon-sun dark:i-carbon-moon />
    </Button>
    <Button
      icon
      text="base"
    >
      <div i-carbon-share />
    </Button>
    <Button
      icon
      text="base"
      @click="isOpen = true"
    >
      <div i-carbon-settings />
    </Button>
    <a href="https://github.com/wheatjs/vueuse-playground" target="_blank">
      <Button
        icon
        text="base"
      >
        <div i-carbon-logo-github />
      </Button>
    </a>
  </div>
</template>
