const ReplaceSimpleIcon = async () => {
  document.querySelectorAll('i.simpleicons').forEach(async (_) => {
    // アイコン名取得
    const name = _.getAttribute('data-name')
    if (name) {
      const { default: simpleicons } = await import('simple-icons')
      const icon = simpleicons.Get(name)
      if (icon) {
        let w = window.getComputedStyle(_).fontSize || '24px'
        const c = window.getComputedStyle(_).color || '#000'

        if (!isNaN(Number(w.replace('px', ''))))
          w = String(Number(w.replace('px', '')) * 1.25) + 'px'

        _.innerHTML = `<svg style="width:${w};height:${w};" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="${c}" d="${icon.path}" /></svg>`
      } else {
        // なければFontAwesomeに置き換える
        _.classList.remove('simpleicons')
        _.classList.add('fab', `fa-${name}`)
      }
    }
  })
}

const simple_icon_ts = async () => {
  ReplaceSimpleIcon()
}

export default simple_icon_ts
