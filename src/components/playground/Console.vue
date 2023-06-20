<script setup lang="ts">
import { orchestrator } from '~/orchestrator'

function symbolFn(params: string | number) {
  return Symbol(params)
}
</script>

<template>
  <div class="overflow-auto">
    <Message
      v-for="message, index in orchestrator.runtimeErrors"
      :key="symbolFn(index)"
      :message="message.toString()"
      type="error"
    />
    <Message
      v-for="message, index in orchestrator.errors"
      :key="symbolFn(index)"
      :message="message.toString()"
      type="error"
    />
  </div>
</template>
