const $ = require('jquery');
import "../slick-1.8.1/slick/slick.js";

window.addEventListener('DOMContentLoaded',()=>{
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

  document.querySelectorAll('img').forEach(_=>_.oncontextmenu=()=>false);

  $("footer a.sBtn").each(function(){
    let a = $(this).attr("href");
    a = a.replace(/PAGEURL/g, encodeURIComponent(location.href));
    a = a.replace(/PAGETITLE/g, $("title").text());
    $(this).attr("href", a)
  })
})