import $ from 'jquery'

window.addEventListener('DOMContentLoaded', () => {
  $('footer a.sBtn').each(function () {
    let a = $(this).attr('href')
    if (a) {
      a = a.replace(/PAGEURL/g, encodeURIComponent(location.href))
      a = a.replace(/PAGETITLE/g, $('title').text())
      $(this).attr('href', a)
    }
  })
})
