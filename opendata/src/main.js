const $ = require('jquery');
const ace = require('ace-builds');
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

  document.querySelectorAll('img').forEach(_=>_.oncontextmenu=()=>false);

  $("footer a.sBtn").each(function(){
    let a = $(this).attr("href");
    a = a.replace(/PAGEURL/g, encodeURIComponent(location.href));
    a = a.replace(/PAGETITLE/g, $(".post-title").text());
    $(this).attr("href", a)
  })

  let fileinfo = {};
  const filepath = $('input[type=hidden][name=fn]').attr("value");
  fileinfo.name = filepath.split("/");
  fileinfo.name = fileinfo.name[fileinfo.name.length - 1]
  fetch(`/data/${filepath}`).then(r=>r.blob()).then(b=>{
    fileinfo.link = URL.createObjectURL(b);
    const sizeUnit = ['Byte', 'KB', 'MB', 'GB', 'TB', 'PB', 'EiB', 'ZB', 'YB'];
    let size = b.size;
    for(let i=0; i<sizeUnit.length; i++){
      if(size / 1024 < 1){
        fileinfo.size = size.toFixed(2) + sizeUnit[i];
        break;
      }
      else{
        size /= 1024;
      }
    }
    $('table td#filesize').text(fileinfo.size)
    $('.modal div.dl button').removeAttr('disabled');
  })

  $('div.flex div.pre').on('click',async function(){
    $('.modal').fadeIn();
    $('.modal .pre, .modal .dl').hide();
    $('.modal .load').show();
    if($(this).hasClass('csv')){
      $('.modal .pre span').text("（CSV版）")
    }
    else if($(this).hasClass('json')){
      $('.modal .pre span').text("（JSON版）")
    }
    const content = await fetch(fileinfo.link).then(r=>r.text());
    const editor = ace.edit("ace",{
      tabSize: 2,
      useSoftTabs: true,
      wrap: true,
      readOnly: true,
    });
    editor.setValue(content);
    document.querySelectorAll('#ace *').forEach(_=>{
      _.oncontextmenu = ()=>false
      _.onselectstart = ()=>false
      _.onselect = ()=>false
      _.onmousedown = ()=>false
      _.onkeydown = ()=>false
    })

    $('.modal .load').hide();
    $('.modal .pre').show();

    gtag('event','opendata',{
      'mode': 'preview',
      'file': fileinfo.name
    });
  })

  $('div.flex div.dl').on('click',async function(){
    $('.modal').fadeIn();
    $('.modal .pre, .modal .load').hide();
    $('.modal .dl').show();
    if($(this).hasClass('csv')){
      $('.modal .dl span').text("（CSV版）")
    }
    else if($(this).hasClass('json')){
      $('.modal .dl span').text("（JSON版）")
    }
    else if($(this).hasClass('json_m')){
      $('.modal .dl span').text("（JSON Minify版）")
    }
  })

  $('.modal div.dl button').on('click',function(){
    const a = document.createElement('a');
    a.download = fileinfo.name
    a.href = fileinfo.link
    gtag('event','opendata',{
      'mode': 'download',
      'file': fileinfo.name
    });
    a.click();
    a.remove();
  })

  $('.modal').on('click',async e=>{
    if(e.target !== e.currentTarget) return;
    $('.modal').fadeOut();
    await sleep(700);
    $('.modal .modal_container > *').hide();
  })

  $('table td#upd').text($('.modal ul p#updated').text());
  $('.modal ul p#updated').remove();
  $('table td').each(function(){
    let ht = $(this).html();
    ht = ht.replace(/\(/gi,'<wbr>(');
    ht = ht.replace(/\_/gi,'<wbr>_');
    ht = ht.replace(/、/gi,'、<wbr>');
    ht = ht.replace(/\"\<wbr\>\_/gi,'"_');
    $(this).html(ht)
  })
})