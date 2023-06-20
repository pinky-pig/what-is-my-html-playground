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
      v-for="message, index in orchestrator.runtimeLogs"
      :key="symbolFn(index)"
      :message="message.toString()"
      type="log"
    />
  </div>
</template>
