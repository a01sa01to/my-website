let isEnglish = false

window.addEventListener('DOMContentLoaded', async () => {
  // URL Query取得
  const query = location.search.substring(1).split('&')

  // language取得
  const lang_query = query.filter((_) => _.startsWith('lang'))[0]
  const lang_cookie = document.cookie
    .split('; ')
    .filter((_) => _.startsWith('lang'))[0]

  // クエリが優先、cookieがあればcookieを参照
  const lang = lang_query || lang_cookie

  // デフォルトは日本語
  const { default: $ } = await import('jquery')
  if (!lang || lang.split('=')[1] === 'ja') {
    $('html').attr('lang', 'ja')
    $('[lang=en]').remove()
    document.cookie = 'lang=ja;domain=a01sa01to.com;max-age=31536000;secure'
    isEnglish = false
  } else {
    $('html').attr('lang', 'en')
    $('[lang=ja]').remove()
    document.cookie = 'lang=en;domain=a01sa01to.com;max-age=31536000;secure'
    isEnglish = true
  }
})

export { isEnglish }
