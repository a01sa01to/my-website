"use strict";(self.webpackChunkdefault=self.webpackChunkdefault||[]).push([[921],{921:(e,t,a)=>{a.r(t),a.d(t,{default:()=>r});const n=async()=>{const{default:e}=await a.e(755).then(a.t.bind(a,755,23));e(".article_container").each((function(){0===e(this).find(".card").length&&(e(this).prev("h2").remove(),e(this).remove())}))},s=async()=>{const{default:e}=await a.e(755).then(a.t.bind(a,755,23));e("img").each((function(){if(e(this).attr("loading","lazy"),e(this).attr("alt")&&!e(this).hasClass("no_alt")){e(this).attr("title",e(this).attr("alt"));const t=document.createElement("div");t.className="imgContainer",this.insertAdjacentElement("beforebegin",t),e(this).appendTo(t);const a=document.createElement("span");a.className="alt",a.innerText=e(this).attr("alt"),t.appendChild(a)}}))},o=async()=>{const{default:e}=await a.e(755).then(a.t.bind(a,755,23));e("a").each((function(){if(e(this).attr("href").includes("http")){e(this).attr("target","_blank");const t=e(this).attr("rel");if(t){const a=t.replace("nofollow","nofollow sponsored").replace("noopener noreferrer","");e(this).attr("rel",`noopener noreferrer ${a}`)}else e(this).attr("rel","noopener noreferrer")}}))},i=async()=>{const{default:e}=await a.e(755).then(a.t.bind(a,755,23));e(".article").find("h2,h3,h4,h5,h6").each((function(){e("#toc .accordion-body").append(`<a href="#${this.id}" class="${this.tagName.toLowerCase()}">${this.innerText}</a>`)}))},r=async()=>{(async()=>{const e=document.querySelectorAll("div.highlighter-rouge");e.forEach((e=>{const t=e.classList.value.split(" ").filter((e=>e.includes("language")))[0].replace("language-","");e.setAttribute("data-lang",t),e.className=""}));const t=[];for(let n=0;n<e.length;n++){const s=e[n];s.setAttribute("id",`editor_${n}`),s.querySelectorAll("span").forEach((e=>e.outerHTML=e.innerHTML));const o=s.innerText;s.innerHTML="";const{default:i}=await a.e(239).then(a.t.bind(a,239,23)),r=i.edit(`editor_${n}`,{tabSize:2,useSoftTabs:!0,wrap:!0,readOnly:!0,maxLines:10,minLines:1,autoScrollEditorIntoView:!0});switch(s.getAttribute("data-lang")){case"js":const{mode_js:e}=await a.e(395).then(a.t.bind(a,395,23));r.session.setMode(new e.Mode);break;case"cpp":const{mode_cpp:t}=await a.e(81).then(a.t.bind(a,81,23));r.session.setMode(new t.Mode);break;case"html":const{mode_html:n}=await a.e(667).then(a.t.bind(a,667,23));r.session.setMode(new n.Mode);break;case"json":const{mode_json:s}=await a.e(252).then(a.t.bind(a,252,23));r.session.setMode(new s.Mode);break;case"bash":const{mode_bash:o}=await a.e(690).then(a.t.bind(a,690,23));r.session.setMode(new o.Mode);break;case"ts":const{mode_ts:i}=await a.e(506).then(a.t.bind(a,506,23));r.session.setMode(new i.Mode);break;case"powershell":const{mode_ps:c}=await a.e(886).then(a.t.bind(a,886,23));r.session.setMode(new c.Mode);break;default:const{mode_plaintext:l}=await a.e(160).then(a.t.bind(a,160,23));r.session.setMode(new l.Mode)}const{theme_dracula:c}=await a.e(787).then(a.t.bind(a,787,23));r.setTheme(c),r.setValue(o),r.clearSelection(),t.push(r)}})(),n(),s(),o(),(async()=>{const{default:e}=await a.e(755).then(a.t.bind(a,755,23));e("div#yearJump button").on("click",(()=>{location.href=String(e("div#yearJump select").val())}))})(),i(),(async()=>{document.querySelectorAll("ul.list-group.sort").forEach((e=>{const t=Array.prototype.slice.call(e.querySelectorAll("li"));t.sort(((e,t)=>e.getAttribute("data-sort-key")>t.getAttribute("data-sort-key")?1:e.getAttribute("data-sort-key")<t.getAttribute("data-sort-key")?-1:0));for(const a of t)e.appendChild(e.removeChild(a)),console.log(a)}))})()}}}]);