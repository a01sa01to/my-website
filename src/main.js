const $ = require('jquery');
const ace = require('ace-builds');
const ClipboardJS = require('clipboard');
import "../slick-1.8.1/slick/slick.js";

const sleep = s => new Promise(r=>setTimeout(r,s));

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

  const query = location.search.substring(1).split("&");
	const lang_query = query.filter(_=>_.startsWith("lang"))[0];
	const lang_cookie = document.cookie.split('; ').filter(_=>_.startsWith('lang'))[0];
	const lang = lang_query || lang_cookie;
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

  document.querySelectorAll('img').forEach(_=>_.oncontextmenu=()=>false);

  $("footer a.sBtn").each(function(){
    let a = $(this).attr("href");
    a = a.replace(/PAGEURL/g, encodeURIComponent(location.href));
    a = a.replace(/PAGETITLE/g, $("title").text());
    $(this).attr("href", a)
  })

  let filepath = $('input[type=hidden][name=fn]').attr("value");
  const filename = filepath.split("/").slice(-1)[0]
  const filefull = filepath.split("/").slice(-2)[0] + "/" + filename

  $('div.flex div.pre').on('click',async function(){
    $('.modal').fadeIn();
    $('.modal .pre, .modal .dl, .modal .api').hide();
    $('.modal .load').show();
    const content = await fetch(filepath).then(r=>r.blob()).then(b=>{
      filepath = URL.createObjectURL(b)
      return b.text()
    });

    const editor = ace.edit("ace",{
      tabSize: 2,
      useSoftTabs: true,
      wrap: true,
      readOnly: true,
			maxLines: 10,
			minLines: 1,
			autoScrollEditorIntoView: true,
    });
    editor.setValue(content);
    document.querySelectorAll('#ace *').forEach(_=>{
      _.oncontextmenu = ()=>false
      _.onselectstart = ()=>false
      _.onselect = ()=>false
      _.onmousedown = ()=>false
      _.onkeydown = ()=>false
    })
    editor.clearSelection();

    $('.modal .load').hide();
    $('.modal .pre').show();

    gtag('event','opendata',{
      'mode': 'preview',
      'file': filefull
    });
  })

  $('div.flex div.dl').on('click',async function(){
    $('.modal').fadeIn();
    $('.modal .pre, .modal .load, .modal .api').hide();
    $('.modal .dl').show();
  })

  $('div.flex div.api').on('click',async function(){
    $('.modal').fadeIn();
    $('.modal .pre, .modal .load, .modal .dl').hide();
    $('.modal .api').show();
  })

  $('.modal div.dl button').on('click',function(){
    const a = document.createElement('a');
    a.download = filename
    a.href = filepath
    gtag('event','opendata',{
      'mode': 'download',
      'file': filefull
    });
    a.click();
    a.remove();
  })

  const copy = new ClipboardJS('.modal div.api button');
  copy.on('error',(e)=>{
    alert('コピーに失敗しました。')
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
  })

  $('.modal').on('click',async e=>{
    if(e.target !== e.currentTarget) return;
    $('.modal').fadeOut();
    await sleep(700);
    $('.modal .modal_container > *').hide();
  })

  $('table td#upd').text($('.modal .dl ul p#updated').text());
  $('table td#filesize').text($('.modal .dl ul p#filesize').text());
  $('.modal ul p#updated').remove();
  $('.modal ul p#filesize').remove();
  $('table td').each(function(){
    let ht = $(this).html();
    ht = ht.replace(/\(/gi,'<wbr>(');
    ht = ht.replace(/\_/gi,'<wbr>_');
    ht = ht.replace(/、/gi,'、<wbr>');
    ht = ht.replace(/\"\<wbr\>\_/gi,'"_');
    $(this).html(ht)
  })
})