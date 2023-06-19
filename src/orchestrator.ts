import lz from 'lz-string'
import { createEventHook } from '@vueuse/core'
import { compileFile } from './compiler/sfcCompiler'

const shouldUpdateContent = createEventHook()
export const onShouldUpdateContent = shouldUpdateContent.on

export interface OrchestratorPackage {
  name: string
  description?: string
  version?: string
  url: string
  source?: string
}

export type OrchestratorFileName = 'html' | 'css' | 'javascript'
export class OrchestratorFile {
  filename: OrchestratorFileName
  content: string

  constructor(filename: OrchestratorFileName, content: string) {
    this.filename = filename
    this.content = content
  }

  get code() {
    return `
        ${this.content}
      `
  }
}

export interface Orchestrator {
  files: {
    [key: string]: OrchestratorFile
  }
  packages: OrchestratorPackage[]
  activeFilename: string
  errors: (string | Error)[]
  runtimeErrors: (string | Error)[]

  readonly activeFile: OrchestratorFile | undefined
  readonly importMap: string
}

/**
 * Main app orchestrator, handles all the files, import maps, and errors
 */
export const orchestrator: Orchestrator = reactive({
  files: {
    html: new OrchestratorFile('html', `
    <h1>Hello World</h1>
    <h1>Hello World</h1>
    <h1>Hello World</h1>
    <h1>Hello World</h1>
    <h1>Hello World</h1>
    <h1>Hello World</h1>
    <h1>Hello World</h1>
    <h1>Hello World</h1>
    <h1>Hello World</h1>
    <h1>Hello World</h1>
    <h1>Hello World</h1>
    <h1>Hello World</h1>
    <h1>Hello World</h1>
    <h1>Hello World</h1>
    <h1>Hello World</h1>
    <h1>Hello World</h1>
    <h1>Hello World</h1>
    <h1>Hello World</h1>
    `),
    css: new OrchestratorFile('css', 'body:{ background: #fefefe}'),
    javascript: new OrchestratorFile('javascript', 'const info = "Hello World"'),
  },
  packages: [],
  activeFilename: 'html',
  errors: [],
  runtimeErrors: [],

  get activeFile() {
    return orchestrator.files[this.activeFilename]
  },

  get importMap() {
    const imports = orchestrator.packages.map(({ name, url }) => `"${name}": "${url}"`)

    return `
      {
        "imports": {
          ${imports.join(',\n')}
        }
      }
    `
  },
})

/**
 * Setup Watchers
 */

watchEffect(() => {
  if (orchestrator.activeFile)
    compileFile(orchestrator.activeFile)
})
watch(() => orchestrator.activeFilename, () => {
  shouldUpdateContent.trigger(null)
})

export function setActiveFile(name: string) {
  orchestrator.activeFilename = name
}

const initialPackages = [
  {
    name: 'vue-demi',
    source: 'unpkg',
    description: 'Vue Demi (half in French) is a developing utility allows you to write Universal Vue Libraries for Vue 2 & 3',
    url: 'https://unpkg.com/vue-demi/lib/index.mjs',
  },
  {
    name: '@vueuse/shared',
    source: 'unpkg',
    description: 'Shared VueUse utilities.',
    url: 'https://unpkg.com/@vueuse/shared@10.1.0/index.mjs',
  },
  {
    name: '@vueuse/core',
    source: 'unpkg',
    description: 'Collection of essential Vue Composition Utilities',
    url: 'https://unpkg.com/@vueuse/core@10.1.0/index.mjs',
  },
]
function loadInitialState() {
  if (location.hash.slice(1)) {
    const { files, packages } = JSON.parse(lz.decompressFromEncodedURIComponent(location.hash.slice(1)))

    if (files && packages) {
      orchestrator.packages = packages
      setActiveFile('html')
    }
  }
  else {
    orchestrator.packages = initialPackages

    compileFile(orchestrator.files.html)
    compileFile(orchestrator.files.css)
    compileFile(orchestrator.files.javascript)

    setActiveFile('html')
  }
  shouldUpdateContent.trigger(null)
}

setTimeout(() => {
  loadInitialState()
}, 0)
