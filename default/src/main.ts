import 'bootstrap'

import './blog'
import './bootstrap/button-custom'
import './footer'
import './func'
import './language'
import './opendata'
import './simple-icons'

window.addEventListener('DOMContentLoaded', () => {
  document
    .querySelectorAll('img')
    .forEach((_) => (_.oncontextmenu = () => false))
})
