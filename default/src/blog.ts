import ace from 'ace-builds'
import $ from 'jquery'

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
    ace.config.set('basePath', '/deps/ace-mode/')
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
      if (progLang) editor.setOption('mode', `ace/mode/${progLang}`)
      editor.setTheme('ace/theme/dracula')
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
  })
}
