window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.btn.btn-custom').forEach((_) => {
    const color = _.getAttribute('data-bgcolor') || 'initial'
    const foreColor = _.getAttribute('data-fgcolor')
    _.setAttribute(
      'style',
      `${
        _.getAttribute('style') || ''
      } background-color:${color}; border-color:${color}; ${
        foreColor ? 'color:' + foreColor : ''
      }`
    )
  })
  document.querySelectorAll('.btn.btn-outline-custom').forEach((_) => {
    const color = _.getAttribute('data-bgcolor') || 'initial'
    _.setAttribute(
      'style',
      `${_.getAttribute('style') || ''} color:${color}; border-color:${color};`
    )
  })
})
