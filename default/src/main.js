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

  const query = location.search.substring(1).split("&");
	const lang_query = query.filter(_=>_.startsWith("lang"))[0];
	const lang_cookie = document.cookie.split('; ').filter(_=>_.startsWith('lang'))[0];
	const lang = lang_cookie || lang_query;
  if(!lang || lang.split('=')[1] === "ja"){
    $('html').attr('lang','ja');
    $('[lang=en]').remove();
		document.cookie = 'lang=ja;domain=a01sa01to.com;max-age=31536000;secure'
  }
  else{
    $('html').attr('lang','en');
    $('[lang=ja]').remove();
		document.cookie = 'lang=en;domain=a01sa01to.com;max-age=31536000;secure'
  }
})