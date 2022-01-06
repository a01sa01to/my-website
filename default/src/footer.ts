// SocialLink Templateリンクを置き換え
const FooterSocialBtn = async () => {
  const { default: $ } = await import('jquery')
  $('footer a.sBtn').each(function () {
    let a = $(this).attr('href')
    if (a) {
      a = a.replace(/PAGEURL/g, encodeURIComponent(location.href))
      a = a.replace(/PAGETITLE/g, $('title').text())
      $(this).attr('href', a)
    }
  })
}

const footer_ts = async () => {
  FooterSocialBtn()
}

export default footer_ts
