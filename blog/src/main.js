const $ = require('jquery');
const ace = require('ace-builds/src-noconflict/ace.js');

window.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('img').forEach(_=>_.oncontextmenu=()=>false);

	$("footer a.sBtn").each(function(){
		let a = $(this).attr("href");
		a = a.replace(/PAGEURL/g, encodeURIComponent(location.href));
		a = a.replace(/PAGETITLE/g, $("title").text());
		$(this).attr("href", a)
	})

	const codeHighlight = document.querySelectorAll('div.highlighter-rouge');
	let editorlist = [];
	codeHighlight.forEach(_=>{
		const lang = _.classList.value.split(' ').filter(__=>__.includes('language'))[0].replace('language-','');
		_.setAttribute('data-lang',lang)
		_.className = ""
	})
	ace.config.set('basePath','/ace-mode/')
	for (let i = 0; i < codeHighlight.length; i++) {
		const e = codeHighlight[i];
		e.setAttribute('id',`editor_${i}`);
		const code = e.innerText;
		e.innerHTML = "";
		const editor = ace.edit(`editor_${i}`,{
			mode: `ace/mode/${e.getAttribute('data-lang')}`,
			tabSize: 2,
			useSoftTabs: true,
			wrap: true,
			readOnly: true,
			maxLines: 10,
			minLines: 1,
			autoScrollEditorIntoView: true,
		})
		editor.setTheme('ace/theme/dracula')
		editor.setValue(code);
		editor.clearSelection();
		editorlist.push(editor);
	}

	$('.article_container').each(function(){
		const $list = $(this).find(".article_card");
		if($list.length === 0){
			$(this).prev("h2").remove();
		}
	})

	$('img').each(function(){
		$(this).attr('loading','lazy');
		if($(this).attr('alt') && !$(this).hasClass('no_alt')){
			$(this).attr('title',$(this).attr('alt'));
			const imgContainer = document.createElement('div');
			imgContainer.className = "imgContainer";
			this.insertAdjacentElement('beforebegin',imgContainer);
			$(this).appendTo(imgContainer);
			const alt = document.createElement('span');
			alt.className = "alt";
			alt.innerText = $(this).attr('alt')
			imgContainer.appendChild(alt);
		}
	})

	$('a').each(function(){
		if($(this).attr('href').includes('http')){
			$(this).attr('target','_blank');
			const rel = $(this).attr('rel');
			if(rel){
				const rep = rel.replace("nofollow","nofollow sponsored").replace("noopener noreferrer","")
				$(this).attr('rel',`noopener noreferrer ${rep}`);
			}
			else{
				$(this).attr('rel','noopener noreferrer');
			}
		}
	})
})