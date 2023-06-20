import * as defaultCompiler from '@vue/compiler-sfc'
import { ref } from 'vue'
import type { OrchestratorFile as File } from '../orchestrator'

export const MAIN_FILE = 'html'
export const COMP_IDENTIFIER = '__sfc__'

/**
 * The default SFC compiler we are using is built from each commit
 * but we may swap it out with a version fetched from CDNs
 */
let SFCCompiler: typeof defaultCompiler = defaultCompiler

const defaultVueUrl = import.meta.env.PROD
  ? `${location.origin}/vue.runtime.esm-browser.js` // to be copied on build
  : `${location.origin}/src/vue-dev-proxy`

export const vueRuntimeUrl = ref(defaultVueUrl)

export async function setVersion(version: string) {
  const compilerUrl = `https://unpkg.com/@vue/compiler-sfc@${version}/dist/compiler-sfc.esm-browser.js`
  const runtimeUrl = `https://unpkg.com/@vue/runtime-dom@${version}/dist/runtime-dom.esm-browser.js`
  const [compiler] = await Promise.all([
    import(/* @vite-ignore */ compilerUrl),
    import(/* @vite-ignore */ runtimeUrl),
  ])
  SFCCompiler = compiler
  vueRuntimeUrl.value = runtimeUrl

  console.info(`Now using Vue version: ${version}`)
}

export function resetVersion() {
  SFCCompiler = defaultCompiler
  vueRuntimeUrl.value = defaultVueUrl
}

export async function compileFile({ filename, code, content }: File) {
  content = code
}
