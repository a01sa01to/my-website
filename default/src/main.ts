import './func'
import './language'

window.addEventListener('DOMContentLoaded', async () => {
  // 右クリック防止
  document
    .querySelectorAll('img')
    .forEach((_) => (_.oncontextmenu = () => false))

  // Bootstrap
  import('bootstrap').then(() => {
    // カスタマイズ読み込み
    import('./bootstrap/button-custom').then(({ default: btn_custom }) =>
      btn_custom()
    )
  })

  // SimpleIcons
  import('./simple-icons').then(({ default: simple_icon_ts }) =>
    simple_icon_ts()
  )

  // Footer
  import('./footer').then(({ default: footer }) => footer())

  // Blog
  if (location.pathname.includes('/blog/'))
    import('./blog').then(({ default: blog }) => blog())

  // Opendata
  if (location.pathname.includes('/opendata/'))
    import('./opendata').then(({ default: opendata }) => opendata())
})
