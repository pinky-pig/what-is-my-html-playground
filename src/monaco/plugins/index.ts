import type { HTMLPlugin } from './types'
import { vueHTMLPlugin } from './vue'

export const htmlCompletionPlugins: HTMLPlugin[] = [
  vueHTMLPlugin,
]
