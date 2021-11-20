import simpleicons from 'simple-icons'

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('i.simpleicons').forEach((_) => {
    const name = _.getAttribute('data-name')
    if (name) {
      const icon = simpleicons.Get(name)
      if (icon) {
        let w = window.getComputedStyle(_).fontSize || '24px'
        const c = window.getComputedStyle(_).color || '#000'
        if (!isNaN(Number(w.replace('px', ''))))
          w = String(Number(w.replace('px', '')) * 1.25) + 'px'
        _.innerHTML = `<svg style="width:${w};height:${w};" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="${c}" d="${icon.path}" /></svg>`
      } else {
        _.classList.remove('simpleicons')
        _.classList.add('fab', `fa-${name}`)
      }
    }
  })
})
