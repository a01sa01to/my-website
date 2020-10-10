const $ = require('jquery');
import "../slick-1.8.1/slick/slick.js";

window.addEventListener('load',()=>{
  $('.slider').slick({
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    centerMode: true,
    adaptiveHeight: true,
    fade: true,
    autoplay: true,
    autoplaySpeed: 3000,
  });
})
