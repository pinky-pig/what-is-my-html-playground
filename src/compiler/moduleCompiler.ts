import { MagicString } from '@vue/compiler-sfc'
import type { OrchestratorFile as File } from '../orchestrator'
import { orchestrator as store } from '../orchestrator'

export function compileModulesForPreview() {
  return processFile(store.files).reverse()
}

// 这里应该是要做一些 compile 的工作，但是不太熟悉，先将 html 、css 、js 的内容拼接起来
function processFile(files: { [key: string]: File }) {
  const { html, js, css } = {
    html: files.html.content,
    js: files.javascript.content,
    css: files.css.content,
  }

  const s = new MagicString(js)

  if (html) {
    const scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
    const scriptTags = html.match(scriptRegex)
    const otherContent = html.replace(scriptRegex, '')
    if (otherContent)
      s.append(`\nwindow.__html__ += ${JSON.stringify(otherContent)}`)
    if (scriptTags)
      s.append(`\nwindow.__html_script__ = ${JSON.stringify(scriptTags)}`)
  }

  if (css)
    s.append(`\nwindow.__css__ += ${JSON.stringify(css)}`)

  const processed = [s.toString()]

  return processed
}
