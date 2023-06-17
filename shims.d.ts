declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module 'splitpanes'
declare module 'monaco-editor-core/esm/vs/editor/editor.worker'
