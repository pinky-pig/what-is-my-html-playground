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

  constructor(filename: OrchestratorFileName, content: string | undefined) {
    this.filename = filename
    this.content = content || ''
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
    html: new OrchestratorFile('html', ''),
    css: new OrchestratorFile('css', ''),
    javascript: new OrchestratorFile('javascript', ''),
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

export function setActiveFile(name: string) {
  orchestrator.activeFilename = name
}
