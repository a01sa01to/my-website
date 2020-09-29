const $ = require('jquery');
import '../bxslider/dist/jquery.bxslider.min.js'

window.addEventListener('load',()=>{
  $('.slider').bxSlider({captions: true,slideWidth: 600,auto: true});
})