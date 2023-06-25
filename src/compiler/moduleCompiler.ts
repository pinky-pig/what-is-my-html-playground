import { MagicString } from '@vue/compiler-sfc'
import type { OrchestratorFile as File } from '../orchestrator'
import { orchestrator as store } from '../orchestrator'

export function compileModulesForPreview() {
  return processFile(store.files).reverse()
}

// 这里应该是要做一些 compile 的工作，但是不太熟悉，先将 html 、css 、js 的内容拼接起来。
// 1. 首先 html static dom （包括 css 标签或者其他静态标签）
// 2. 其次是 html 中的 script 脚本内容 （包块 src 或者 代码运行块，因为都需要运行）
// 3. CSS 部分
// 4. JS 部分

function processFile(files: { [key: string]: File }) {
  const { html, js, css } = {
    html: files.html.content,
    js: files.javascript.content,
    css: files.css.content,
  }

  // 4. JS 部分，这里的 js 是 用户自己写的 js 。后面使用 prepend 而不是 append 是为了让代码块中的 js 放在最后运行
  const s = new MagicString(js)

  if (css) {
    // 3. CSS 部分
    s.prepend(`\nwindow.__css__ += ${JSON.stringify(css)}\ndocument.getElementById('__sfc-styles').innerHTML = window.__css__\n`)
  }

  if (html) {
    const scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
    const scriptTags = html.match(scriptRegex)
    const otherContent = html.replace(scriptRegex, '')

    if (scriptTags) {
      // 2. 其次是 html 中的 script 脚本内容 （包块 src 或者 代码运行块，因为都需要运行）
      s.prepend(`
        \nwindow.__html_script__ = ${JSON.stringify(scriptTags.join(''))}\n
        const appElement = document.getElementById('__sfc-scripts')
        appElement.textContent = ''
        const newRange = document.createRange()
        newRange.selectNode(appElement)
        if (window.__html_script__) {
          const newFragment = newRange.createContextualFragment(window.__html_script__)
          appElement.appendChild(newFragment)
        }
      `)
    }
    if (otherContent) {
      // 1. html static dom （包括 css 标签或者其他静态标签）
      s.prepend(`\nwindow.__html__ += ${JSON.stringify(otherContent)}\ndocument.getElementById('app').innerHTML = window.__html__\n`)
    }
  }

  const processed = [s.toString()]

  return processed
}
