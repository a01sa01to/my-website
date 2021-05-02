import 'bootstrap'
import './blog'
import './footer'
import './func'
import './language'
import './opendata'
import './slick'

window.addEventListener('DOMContentLoaded', () => {
  document
    .querySelectorAll('img')
    .forEach((_) => (_.oncontextmenu = () => false))
})
