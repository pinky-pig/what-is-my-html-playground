<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'
import { onShouldUpdateContent, orchestrator } from '~/orchestrator'

const initialHtml = ref(orchestrator.activeFile?.content || '')

// 监听触发更新
onShouldUpdateContent(() => {
  if (orchestrator.activeFile)
    initialHtml.value = orchestrator.activeFile?.content
})
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
                  :language="orchestrator.activeFile?.filename || 'html'"
                  :value="initialHtml"
                  @change="content => onContentChanged('html', content)"
                />
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
            <div h="full">
              <Preview shadow="lg" bg="dark:dark-700 light-100" />
            </div>
          </Container>
        </Pane>
        <Pane size="25">
          <Container title="Console">
            <Console />
          </Container>
        </Pane>
      </Splitpanes>
    </Pane>
  </Splitpanes>
</template>
