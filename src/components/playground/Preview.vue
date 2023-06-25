<script setup lang="ts">
import type { WatchStopHandle } from 'vue'

// import { useElementSize, useCssVar } from '@vueuse/core'
import srcdoc from '../template.html?raw'
import { PreviewProxy } from '~/logic/PreviewProxy'
import { vueRuntimeUrl } from '~/compiler/sfcCompiler'
import { compileModulesForPreview } from '~/compiler/moduleCompiler'
import { orchestrator, orchestrator as store } from '~/orchestrator'

const container = ref()
const runtimeError = ref()
const runtimeWarning = ref()
const runtimeLog = ref<string[]>([])

let last_log = ''
let sandbox: HTMLIFrameElement
let proxy: PreviewProxy
let stopUpdateWatcher: WatchStopHandle

watch([runtimeError, runtimeWarning], () => {
  orchestrator.runtimeErrors = [runtimeError.value, runtimeWarning.value].filter(x => x)
})

watch(runtimeLog, (n, o) => {
  if (n === null)
    return
  orchestrator.runtimeLogs = runtimeLog.value
}, {
  deep: true,
})

// 创建沙盒
onMounted(createSandbox)
// 当引入的依赖有变化的时候，重置沙盒
watch(() => store.importMap, (importMap, prev) => {
  if (!importMap) {
    if (prev) {
      // import-map.json deleted
      createSandbox()
    }
    return
  }
  try {
    const map = JSON.parse(importMap)
    if (!map.imports) {
      store.errors = [
        'import-map.json is missing "imports" field.',
      ]
      return
    }
    if (map.imports.vue) {
      store.errors = [
        'Select Vue versions using the top-right dropdown.\n'
        + 'Specifying it in the import map has no effect.',
      ]
    }
    createSandbox()
  }
  catch (e) {
    store.errors = [e as string]
  }
})
// 当版本有变化的时候，重置沙盒
watch(vueRuntimeUrl, createSandbox)
// 离开页面的时候，销毁沙盒
onUnmounted(() => {
  proxy.destroy()
  stopUpdateWatcher && stopUpdateWatcher()
})

// ##创建沙盒##
function createSandbox() {
  // 1. 创建之前先将原来的销毁
  if (sandbox) {
    proxy.destroy()
    if (stopUpdateWatcher)
      stopUpdateWatcher()
    container.value.removeChild(sandbox)
  }
  // 2. 开始创建
  sandbox = document.createElement('iframe')
  // 3. 设置sandbox属性
  sandbox.setAttribute('sandbox', [
    'allow-forms',
    'allow-modals',
    'allow-pointer-lock',
    'allow-popups',
    'allow-same-origin',
    'allow-scripts',
    'allow-top-navigation-by-user-activation',
  ].join(' '))

  // 4. 设置引入的依赖库
  let importMap: Record<string, any>
  try {
    importMap = JSON.parse(store.importMap || '{}')
  }
  catch (e) {
    store.errors = [`Syntax error in import-map.json: ${(e as any).message}`]
    return
  }
  if (!importMap.imports)
    importMap.imports = {}

  importMap.imports.vue = vueRuntimeUrl.value
  // 5. 将依赖库替换到模板中，然后将模板设置给 iframe
  const sandboxSrc = srcdoc.replace(/<!--IMPORT_MAP-->/, JSON.stringify(importMap))
  sandbox.srcdoc = sandboxSrc
  // 6. 将 iframe 添加到页面中
  container.value.appendChild(sandbox)

  // 7. 创建代理，使用代理来操作 iframe ，详情见 PreviewProxy 文件
  proxy = new PreviewProxy(sandbox, {
    on_fetch_progress: (progress: any) => {
      // pending_imports = progress;
    },
    on_error: (event: any) => {
      const msg = event.value instanceof Error ? event.value.message : event.value
      if (
        msg?.includes('Failed to resolve module specifier')
        || msg?.includes('Error resolving module specifier')
      ) {
        runtimeError.value = `${msg.replace(/\. Relative references must.*$/, '')
        }.\nTip: add an "import-map.json" file to specify import paths for dependencies.`
      }
      else {
        runtimeError.value = event.value || 'Unknown error. Please check your browser console.'
      }
    },
    on_unhandled_rejection: (event: any) => {
      let error = event.value
      if (typeof error === 'string')
        error = { message: error }

      runtimeError.value = `Uncaught (in promise): ${error.message}`
    },
    on_console: (log: any) => {
      if (log.level === 'error') {
        if (log.args[0] instanceof Error)
          runtimeError.value = log.args[0].message
        else
          runtimeError.value = log.args[0]
      }
      else if (log.level === 'warn') {
        if (log.args[0].toString().includes('[Vue warn]')) {
          runtimeWarning.value = log.args
            .join('')
            .replace(/\[Vue warn\]:/, '')
            .trim()
        }
      }
      else if (log.level === 'log') {
        // 如果 log 为 null ，从头打印 log
        if (log.duplicate)
          increment_duplicate_log()
        else
          push_logs(log.args.join(''))
      }
    },
    on_console_group: (action: any) => {
      // group_logs(action.label, false);
    },
    on_console_group_end: () => {
      // ungroup_logs();
    },
    on_console_group_collapsed: (action: any) => {
      // group_logs(action.label, true);
    },
  })

  // 8. 监听 iframe 的 load 事件，然后页面执行监听，用于修改代码后，页面自动更新
  sandbox.addEventListener('load', () => {
    proxy.handle_links()
    stopUpdateWatcher = watchEffect(updatePreview)
  })

  // 添加 log
  function push_logs(log: string) {
    last_log = log
    runtimeLog.value.push(log)
  }
  // 复制的时候 log
  function increment_duplicate_log() {
    push_logs(last_log)
  }
}
// ##更新沙盒##
async function updatePreview() {
  // console.clear()
  runtimeError.value = null
  runtimeWarning.value = null
  runtimeLog.value.splice(0)

  try {
    const modules = compileModulesForPreview()
    await proxy.eval([
      'window.__modules__ = {};window.__css__ = \'\';window.__html__ = \'\'',
      ...modules,
      isDark.value ? 'document.querySelector("html").classList.add("dark")' : 'document.querySelector("html").classList.remove("dark")',
    ])
  }
  catch (e) {
    runtimeError.value = (e as any).message
  }
}

watch(isImmediateRun, (v) => {
  if (v) {
    // 说明需要立即执行响应
    stopUpdateWatcher = watchEffect(updatePreview)
  }
  else {
    // 说明不需要立即执行响应
    stopUpdateWatcher && stopUpdateWatcher()
  }
})
watch(isRunOnce, (v) => {
  // 说明需要立即执行一次响应
  updatePreview()
})
</script>

<template>
  <div
    ref="container"
    w="full"
    h="full"
    flex="~"
    class="preview-container"
    place="items-center content-center"
  />
</template>

<style>
.preview-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.preview-container,
iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
