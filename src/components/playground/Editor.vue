<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMonaco } from '~/logic/useMonaco/index'

const props = defineProps<{ language: string; value: string }>()
const emit = defineEmits<(e: 'change', content: string) => void>()
const target = ref()
const { onChange, setContent, setLanguage } = useMonaco(target, {
  language: props.language,
  code: props.value,
})

watch(() => props.value, () => setContent(props.value))
watch(() => props.language, () => setLanguage(props.language))
onChange((content: string) => emit('change', content))
emit('change', props.value)
</script>

<template>
  <div ref="target" class="h-full w-full" />
</template>
