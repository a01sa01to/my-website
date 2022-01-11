import { Ace } from 'ace-builds'

import { isEnglish } from './language'

let editor: Ace.Editor

const AceEditorInit = async () => {
  const { default: $ } = await import('jquery')
  const { default: Ace } = await import('ace-builds')

  editor = Ace.edit('ace', {
    tabSize: 4,
    useSoftTabs: true,
    wrap: true,
    readOnly: true,
    maxLines: 10,
    minLines: 1,
    fontSize: 14,
  })

  // テーマ設定
  const { default: theme_github } = await import(
    'ace-builds/src-noconflict/theme-github'
  )
  editor.setTheme(theme_github)

  // データ形式を取得し、Aceのモード指定
  const format = $('table td#format').text()

  /* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
  if (format === 'CSV') {
    const { default: mode_csv } = await import(
      'ace-builds/src-noconflict/mode-plain_text'
    )
    editor.session.setMode(new mode_csv.Mode())
  }
  if (format === 'JSON') {
    const { default: mode_json } = await import(
      'ace-builds/src-noconflict/mode-json'
    )
    editor.session.setMode(new mode_json.Mode())
  }
  /* eslint-enable */

  // コピー系を無効化
  document.querySelectorAll('#ace *').forEach((__) => {
    const _ = __ as HTMLElement
    _.oncontextmenu = () => false
    _.onselectstart = () => false
    _.onselect = () => false
    _.onmousedown = () => false
    _.onkeydown = () => false
  })
}

const PreviewOpendata = async (filepath: string, filefull: string) => {
  const { default: $ } = await import('jquery')
  $('div.flex button.pre').on('click', async function () {
    // いったんLoadingを表示
    editor.setValue('Loading...')
    editor.clearSelection()

    // ファイル読み込み
    const content = await fetch(filepath!)
      .then((r) => r.blob())
      .then((b) => {
        filepath = URL.createObjectURL(b)
        return b.text()
      })
      .catch((r) => {
        console.error(r)
        return isEnglish
          ? 'Failed to load file...'
          : 'ファイルの読み込みに失敗しました...'
      })

    // ファイルを表示
    editor.setValue(content)
    editor.clearSelection()

    // gtagに送信
    gtag('event', 'opendata_preview', {
      mode: 'preview',
      file: filefull,
    })
  })
}

const DownloadOpendata = async (
  filepath: string,
  filename: string,
  filefull: string
) => {
  const { default: $ } = await import('jquery')
  $('.modal#dl button.btn-outline-primary').on('click', function () {
    // ファイルダウンロード
    const a = document.createElement('a')
    a.download = filename
    a.href = filepath!
    a.click()
    a.remove()

    // gtagに送信
    gtag('event', 'opendata_download', {
      mode: 'download',
      file: filefull,
    })
  })
}

const CopyOpendataURL = async () => {
  const { default: $ } = await import('jquery')
  const { default: ClipboardJS } = await import('clipboard')

  // 押されたらコピーするボタン
  const copy = new ClipboardJS('.modal#api button.btn-outline-primary')

  // Toastを表示する要素
  const { Toast } = await import('bootstrap')
  const copyToastElem = document.querySelector('.modal#api .toast')
  const copyToast = new Toast(copyToastElem || '.modal#api .toast')

  // Copy on Error
  copy.on('error', (e) => {
    console.error('Action:', e.action)
    console.error('Trigger:', e.trigger)
    if (copyToastElem) {
      copyToastElem.innerHTML = isEnglish
        ? 'Failed to Copy the Data'
        : 'コピーに失敗しました'
      copyToastElem.classList.remove('bg-success')
      copyToastElem.classList.add('bg-danger')
      copyToast.show()
    }
  })

  // Copy on Success
  $('.modal#api button.btn-outline-primary').on('click', () => {
    if (copyToastElem) {
      copyToastElem.innerHTML = isEnglish ? 'Copied!' : 'コピーしました'
      copyToastElem.classList.remove('bg-danger')
      copyToastElem.classList.add('bg-success')
      copyToast.show()
    }
  })
}

const InitializeOpendataTable = async () => {
  const { default: $ } = await import('jquery')

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

const opendata_ts = async () => {
  const { default: $ } = await import('jquery')
  let filepath = $('input[type=hidden][name=fn]').attr('value')
  if (filepath) {
    const filename = filepath.split('/').slice(-1)[0]
    const filefull = filepath.split('/').slice(-2)[0] + '/' + filename
    AceEditorInit()
    PreviewOpendata(filepath, filefull)
    DownloadOpendata(filepath, filename, filefull)
    CopyOpendataURL()
    InitializeOpendataTable()
  }
}

export default opendata_ts
