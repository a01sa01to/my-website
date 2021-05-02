import Ace from 'ace-builds'
import mode_json from 'ace-builds/src-noconflict/mode-json'
import mode_csv from 'ace-builds/src-noconflict/mode-plain_text'
import theme_github from 'ace-builds/src-noconflict/theme-github'
import { Toast } from 'bootstrap'
import ClipboardJS from 'clipboard'
import $ from 'jquery'

if (location.pathname.includes('/opendata/')) {
  window.addEventListener('DOMContentLoaded', () => {
    let filepath = $('input[type=hidden][name=fn]').attr('value')
    if (filepath) {
      const filename = filepath.split('/').slice(-1)[0]
      const filefull = filepath.split('/').slice(-2)[0] + '/' + filename

      const editor = Ace.edit('ace', {
        tabSize: 4,
        useSoftTabs: true,
        wrap: true,
        readOnly: true,
        maxLines: 10,
        minLines: 1,
        fontSize: 14,
      })
      editor.setTheme(theme_github)
      const format = $('table td#format').text()

      /* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
      if (format === 'CSV') {
        editor.session.setMode(new mode_csv.Mode())
      }
      if (format === 'JSON') {
        editor.session.setMode(new mode_json.Mode())
      }
      /* eslint-enable */

      document.querySelectorAll('#ace *').forEach((__) => {
        const _ = __ as HTMLElement
        _.oncontextmenu = () => false
        _.onselectstart = () => false
        _.onselect = () => false
        _.onmousedown = () => false
        _.onkeydown = () => false
      })

      $('div.flex button.pre').on('click', async function () {
        editor.setValue('Loading...')
        editor.clearSelection()

        const content = await fetch(filepath!)
          .then((r) => r.blob())
          .then((b) => {
            filepath = URL.createObjectURL(b)
            return b.text()
          })

        editor.setValue(content)
        editor.clearSelection()

        gtag('event', 'opendata', {
          mode: 'preview',
          file: filefull,
        })
      })

      $('.modal#dl button.btn-outline-primary').on('click', function () {
        const a = document.createElement('a')
        a.download = filename
        a.href = filepath!
        gtag('event', 'opendata', {
          mode: 'download',
          file: filefull,
        })
        a.click()
        a.remove()
      })

      const copy = new ClipboardJS('.modal#api button.btn-outline-primary')

      const copyToastElem = document.querySelector('.modal#api .toast')
      const copyToast = new Toast(copyToastElem || '.modal#api .toast')

      copy.on('error', (e) => {
        console.error('Action:', e.action)
        console.error('Trigger:', e.trigger)
        if (copyToastElem) {
          copyToastElem.innerHTML = 'コピーに失敗しました'
          copyToastElem.classList.remove('bg-success')
          copyToastElem.classList.add('bg-danger')
          copyToast.show()
        }
      })
      $('.modal#api button.btn-outline-primary').on('click', () => {
        if (copyToastElem) {
          copyToastElem.innerHTML = 'コピーしました'
          copyToastElem.classList.remove('bg-danger')
          copyToastElem.classList.add('bg-success')
          copyToast.show()
        }
      })

      $('table td#upd').text($('.modal#dl ul p#updated').text())
      $('table td#filesize').text($('.modal#dl ul p#filesize').text())
      $('.modal ul p#updated').remove()
      $('.modal ul p#filesize').remove()
      $('table td').each(function () {
        let ht = $(this).html()
        ht = ht.replace(/\(/gi, '<wbr>(')
        ht = ht.replace(/\_/gi, '<wbr>_')
        ht = ht.replace(/、/gi, '、<wbr>')
        ht = ht.replace(/\"\<wbr\>\_/gi, '"_')
        $(this).html(ht)
      })
    }
  })
}
