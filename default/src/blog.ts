import ace from 'ace-builds'
import $ from 'jquery'
import mode_cpp from 'ace-builds/src-noconflict/mode-c_cpp'
import mode_html from 'ace-builds/src-noconflict/mode-html'
import mode_js from 'ace-builds/src-noconflict/mode-javascript'
import mode_json from 'ace-builds/src-noconflict/mode-json'
import mode_plaintext from 'ace-builds/src-noconflict/mode-plain_text'
import mode_bash from 'ace-builds/src-noconflict/mode-sh'
import mode_ts from 'ace-builds/src-noconflict/mode-typescript'
import theme_dracula from 'ace-builds/src-noconflict/theme-dracula'

if (location.pathname.includes('/blog/')) {
  window.addEventListener('DOMContentLoaded', () => {
    const codeHighlight = document.querySelectorAll('div.highlighter-rouge')
    const editorlist = []
    codeHighlight.forEach((_) => {
      const lang = _.classList.value
        .split(' ')
        .filter((__) => __.includes('language'))[0]
        .replace('language-', '')
      _.setAttribute('data-lang', lang)
      _.className = ''
    })
    for (let i = 0; i < codeHighlight.length; i++) {
      const e = codeHighlight[i] as HTMLElement
      e.setAttribute('id', `editor_${i}`)
      const code = e.innerText
      e.innerHTML = ''
      const editor = ace.edit(`editor_${i}`, {
        tabSize: 2,
        useSoftTabs: true,
        wrap: true,
        readOnly: true,
        maxLines: 10,
        minLines: 1,
        autoScrollEditorIntoView: true,
      })
      const progLang = e.getAttribute('data-lang')

      /* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
      switch (progLang) {
        case 'js':
          editor.session.setMode(new mode_js.Mode())
          break
        case 'cpp':
          editor.session.setMode(new mode_cpp.Mode())
          break
        case 'html':
          editor.session.setMode(new mode_html.Mode())
          break
        case 'json':
          editor.session.setMode(new mode_json.Mode())
          break
        case 'bash':
          editor.session.setMode(new mode_bash.Mode())
          break
        case 'ts':
          editor.session.setMode(new mode_ts.Mode())
          break
        default:
          editor.session.setMode(new mode_plaintext.Mode())
          break
      }
      /* eslint-enable */

      editor.setTheme(theme_dracula)
      editor.setValue(code)
      editor.clearSelection()
      editorlist.push(editor)
    }

    $('.article_container').each(function () {
      const $list = $(this).find('.card')
      if ($list.length === 0) {
        $(this).prev('h2').remove()
        $(this).remove()
      }
    })

    $('img').each(function () {
      $(this).attr('loading', 'lazy')
      if ($(this).attr('alt') && !$(this).hasClass('no_alt')) {
        $(this).attr('title', $(this).attr('alt') as string)
        const imgContainer = document.createElement('div')
        imgContainer.className = 'imgContainer'
        this.insertAdjacentElement('beforebegin', imgContainer)
        $(this).appendTo(imgContainer)
        const alt = document.createElement('span')
        alt.className = 'alt'
        alt.innerText = $(this).attr('alt')!
        imgContainer.appendChild(alt)
      }
    })

    $('a').each(function () {
      if ($(this).attr('href')!.includes('http')) {
        $(this).attr('target', '_blank')
        const rel = $(this).attr('rel')
        if (rel) {
          const rep = rel
            .replace('nofollow', 'nofollow sponsored')
            .replace('noopener noreferrer', '')
          $(this).attr('rel', `noopener noreferrer ${rep}`)
        } else {
          $(this).attr('rel', 'noopener noreferrer')
        }
      }
    })

    $('div#yearJump button').on('click', () => {
      location.href = String($('div#yearJump select').val())
    })

    $('.article')
      .find('h2,h3,h4,h5,h6')
      .each(function () {
        $('#toc .accordion-body').append(
          `<a href="#${this.id}" class="${this.tagName.toLowerCase()}">${
            this.innerText
          }</a>`
        )
      })
  })
}
