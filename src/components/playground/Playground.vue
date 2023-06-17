<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'
import { orchestrator } from '~/orchestrator'

const initialHtml = ref('<div>Hello world</div>')

function onContentChanged(source: string, content: string) {
  if (orchestrator.activeFile)
    orchestrator.activeFile.content = content
}
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
                <Editor
                  language="javascript"
                  :value="initialHtml"
                  @change="content => onContentChanged('script', content)"
                />
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
