// Aceの初期化
const AceEditorInit = async () => {
  // ハイライト部分
  const codeHighlight = document.querySelectorAll('div.highlighter-rouge')
  // 言語取得・設定
  codeHighlight.forEach((_) => {
    const lang = _.classList.value
      .split(' ')
      .filter((__) => __.includes('language'))[0]
      .replace('language-', '')

    _.setAttribute('data-lang', lang)
    _.className = ''
  })

  // Editor
  const editorlist = []

  for (let i = 0; i < codeHighlight.length; i++) {
    const e = codeHighlight[i] as HTMLElement
    e.setAttribute('id', `editor_${i}`)

    // これがないとPowershellとかで毎単語で改行される
    e.querySelectorAll('span').forEach((_) => (_.outerHTML = _.innerHTML))

    const code = e.innerText
    e.innerHTML = ''

    const { default: ace } = await import('ace-builds')

    const editor = ace.edit(`editor_${i}`, {
      tabSize: 2,
      useSoftTabs: true,
      wrap: true,
      readOnly: true,
      maxLines: 10,
      minLines: 1,
      autoScrollEditorIntoView: true,
    })

    // 言語に応じてモード設定
    const progLang = e.getAttribute('data-lang')
    /* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
    switch (progLang) {
      case 'js':
        const { mode_js } = await import(
          'ace-builds/src-noconflict/mode-javascript'
        )
        editor.session.setMode(new mode_js.Mode())
        break
      case 'cpp':
        const { mode_cpp } = await import(
          'ace-builds/src-noconflict/mode-c_cpp'
        )
        editor.session.setMode(new mode_cpp.Mode())
        break
      case 'html':
        const { mode_html } = await import(
          'ace-builds/src-noconflict/mode-html'
        )
        editor.session.setMode(new mode_html.Mode())
        break
      case 'json':
        const { mode_json } = await import(
          'ace-builds/src-noconflict/mode-json'
        )
        editor.session.setMode(new mode_json.Mode())
        break
      case 'bash':
        const { mode_bash } = await import('ace-builds/src-noconflict/mode-sh')
        editor.session.setMode(new mode_bash.Mode())
        break
      case 'ts':
        const { mode_ts } = await import(
          'ace-builds/src-noconflict/mode-typescript'
        )
        editor.session.setMode(new mode_ts.Mode())
        break
      case 'powershell':
        const { mode_ps } = await import(
          'ace-builds/src-noconflict/mode-powershell'
        )
        editor.session.setMode(new mode_ps.Mode())
        break
      default:
        const { mode_plaintext } = await import(
          'ace-builds/src-noconflict/mode-plain_text'
        )
        editor.session.setMode(new mode_plaintext.Mode())
        break
    }
    /* eslint-enable */

    // テーマ設定
    const { theme_dracula } = await import(
      'ace-builds/src-noconflict/theme-dracula'
    )
    editor.setTheme(theme_dracula)

    // コードを入れる
    editor.setValue(code)

    // コードの選択を解除
    editor.clearSelection()

    // Editorを配列に入れる
    editorlist.push(editor)
  }
}

// 月ごとのブログ一覧、もし記事がなければ削除
// Ref: _layouts/blog_list.html
const MonthlyBlogList_EmptyRemove = async () => {
  const { default: $ } = await import('jquery')
  $('.article_container').each(function () {
    const $list = $(this).find('.card')
    if ($list.length === 0) {
      $(this).prev('h2').remove()
      $(this).remove()
    }
  })
}

// 画像の下に表示するタイトル
const ImgTitleDisplay = async () => {
  const { default: $ } = await import('jquery')
  $('img').each(function () {
    // 画像をLazy-loadにする
    $(this).attr('loading', 'lazy')

    // 代替テキストがあれば、画像の下に表示
    if ($(this).attr('alt') && !$(this).hasClass('no_alt')) {
      $(this).attr('title', $(this).attr('alt') as string) // 代替テキストをタイトルにする
      // divに画像とテキストを入れる
      const imgContainer = document.createElement('div')
      imgContainer.className = 'imgContainer'
      this.insertAdjacentElement('beforebegin', imgContainer)
      $(this).appendTo(imgContainer)
      const alt = document.createElement('span')
      alt.className = 'alt'
      alt.innerText = $(this).attr('alt')! // if文であることが前提
      imgContainer.appendChild(alt)
    }
  })
}

// 外部リンクは、新タブ・NoRefを付与
const ExternalLinkSetting = async () => {
  const { default: $ } = await import('jquery')
  $('a').each(function () {
    if ($(this).attr('href')!.includes('http')) {
      // 外部リンクの場合
      $(this).attr('target', '_blank')
      const rel = $(this).attr('rel')
      // Sponsorリンク
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
}

// 何年に飛ぶのかボタン
const YearJumpButton = async () => {
  const { default: $ } = await import('jquery')
  $('div#yearJump button').on('click', () => {
    location.href = String($('div#yearJump select').val())
  })
}

// 目次生成
const TableOfContentsGenerate = async () => {
  const { default: $ } = await import('jquery')
  $('.article')
    .find('h2,h3,h4,h5,h6')
    .each(function () {
      $('#toc .accordion-body').append(
        `<a href="#${this.id}" class="${this.tagName.toLowerCase()}">${
          this.innerText
        }</a>`
      )
    })
}

// タグ一覧で、アルファベット順にソート
const TagListSort = async () => {
  document.querySelectorAll('ul.list-group.sort').forEach((_) => {
    const arr: HTMLLIElement[] = Array.prototype.slice.call(
      _.querySelectorAll('li')
    )
    arr.sort((a, b) => {
      if (a.getAttribute('data-sort-key')! > b.getAttribute('data-sort-key')!) {
        return 1
      } else if (
        a.getAttribute('data-sort-key')! < b.getAttribute('data-sort-key')!
      ) {
        return -1
      } else {
        return 0
      }
    })
    for (const list of arr) {
      _.appendChild(_.removeChild(list))
      console.log(list)
    }
  })
}

const blog_ts = async () => {
  AceEditorInit()
  MonthlyBlogList_EmptyRemove()
  ImgTitleDisplay()
  ExternalLinkSetting()
  YearJumpButton()
  TableOfContentsGenerate()
  TagListSort()
}

export default blog_ts
