<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'
</script>

<template>
  <Splitpanes class="default-theme">
    <Pane>
      <div class="h-full flex flex-col">
        <TabBar />
        <Splitpanes class="default-theme editors-height" horizontal>
          <Pane>
            <Container title="" class="rounded-b-md" no-overflow no-rounding>
              <template #default>
                <div class="h-full w-full bg-green-300" />
              </template>
            </Container>
          </Pane>
        </Splitpanes>
      </div>
    </Pane>
    <Pane>
      <Splitpanes horizontal class="default-theme">
        <Pane>
          <Container title="Output">
            <div class="h-full w-full bg-orange-300" />
          </Container>
        </Pane>
        <Pane size="25">
          <Container title="Console">
            <div class="h-full w-full bg-purple-300" />
          </Container>
        </Pane>
      </Splitpanes>
    </Pane>
  </Splitpanes>
</template>
