<script setup lang="ts">
// const props = defineProps<{ modelValue: boolean }>()
// const isOpen = useVModel(props)

function toggleDark(event: MouseEvent) {
  // @ts-expect-error experimental API
  const isAppearanceTransition = document.startViewTransition
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!isAppearanceTransition) {
    isDark.value = !isDark.value
    return
  }

  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  )
  // @ts-expect-error: Transition API
  const transition = document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  })
  transition.ready
    .then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ]
      document.documentElement.animate(
        {
          clipPath: isDark.value
            ? [...clipPath].reverse()
            : clipPath,
        },
        {
          duration: 400,
          easing: 'ease-out',
          pseudoElement: isDark.value
            ? '::view-transition-old(root)'
            : '::view-transition-new(root)',
        },
      )
    })
}
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
      @click="toggleDark"
    >
      <div i-carbon-sun dark:i-carbon-moon />
    </Button>
    <!-- <Button
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
    </Button> -->
    <a href="https://github.com/pinky-pig/what-is-my-html-playground" target="_blank">
      <Button
        icon
        text="base"
      >
        <div i-carbon-logo-github />
      </Button>
    </a>
  </div>
</template>
