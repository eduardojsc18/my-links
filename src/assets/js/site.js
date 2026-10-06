import { collections } from './links.js';
import {capturePortrait,animatePortraitTransition,stopPortraitTransition} from './portrait-motion.js';
import {initSceneMotion} from './scene-motion.js';
import {initProfilePages} from './profile-pages.js';
import {profileFromUrl,profileUrl,shareProfileUrl} from './profile-url.js';
import {initSectionNavigation} from './section-navigation.js';

// Approved transparent portraits, one for each profile.

export const profiles = {
  casual: { name: 'Casual', photo: 'assets/img/eduardo-casual-v1.png', alt: 'Eduardo José com camiseta verde-escura, em um retrato descontraído sem fundo', description: 'Crio para a web. Compartilho ideias e projetos por aqui.', about: 'Gosto de transformar ideias em experiências digitais simples e úteis. Este é meu espaço para compartilhar o que crio, o que uso e o que faz parte do meu dia a dia.', color: '#f7f6f2', link: 'https://www.facebook.com/eduard0jsc', label: 'Vamos nos conectar' },
  gamer: { name: 'Gamer', photo: 'assets/img/eduardo-gamer-v1.png', alt: 'Eduardo José com headset preto e camiseta grafite, em um retrato sem fundo', description: 'Do CS 1.6 ao CS2. Um round de cada vez.', about: 'O Counter-Strike me acompanha desde o 1.6. Cheguei à Global no CS:GO e hoje meu casual é o CS2. Sem mapa ou posição favorita: vou onde o round precisar. Aqui você conhece minha história nos jogos, meu inventário e o PC que me acompanha.', color: '#191619', link: 'https://steamcommunity.com/id/rvermeio/', label: 'Bora de lobby? Me adiciona na Steam' },
  professional: { name: 'Business', photo: 'assets/img/eduardo-business-v1.png', alt: 'Eduardo José com camiseta preta lisa, em um retrato profissional sem fundo', description: 'Empreendedor, desenvolvedor e criador de sistemas para operações reais.', about: 'Minha trajetória em tecnologia começou em 2011. Hoje sou empresário, desenvolvo sistemas e vendo produtos de múltiplos nichos no e-commerce. Trabalho dos dois lados: construindo as ferramentas e vivendo a operação que elas precisam resolver.', color: '#eeeae3', link: 'https://www.linkedin.com/in/eduardojsc/', label: 'Conheça meu perfil no LinkedIn' },
};
const root = document.documentElement;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const $ = selector => document.querySelector(selector);
const icon = name => { const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); const use = document.createElementNS(svg.namespaceURI, 'use'); use.setAttribute('href', `#${name}`); svg.append(use); svg.setAttribute('aria-hidden', 'true'); return svg; };
function externalLink(href, text, className = '') { const a = document.createElement('a'); a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.className = className; if(text) a.textContent = text; return a; }
function image(src, alt) { const img = document.createElement('img'); img.src = src; img.alt = alt; img.loading = 'lazy'; img.decoding = 'async'; return img; }
const descriptions = { 'Seu Zé': 'Uma landing page para produtos naturais da fazenda.', 'Share': 'Compartilhamento de imagens com Web Share API.', 'Meu Portfólio': 'Um pouco da minha trajetória no desenvolvimento web.', 'Make Your Burguer': 'Um projeto de estudos em Vue.js para montar pedidos.', 'Landing Page': 'Landing page para uma corretora de planos de saúde.' };
const projects = collections.find(c => c.name === 'Projetos')?.items ?? [];
// The legacy To do List points to the portfolio. Keep its data for later review.
const visibleProjects = projects.filter(p => p.name !== 'To do List');
for (const [index, name] of ['Seu Zé', 'Share'].entries()) {
  const p = visibleProjects.find(p => p.name === name); if(!p) continue;
  const card = document.createElement('article'); card.className = 'project-card reveal';
  const preview = externalLink(p.linkGitHubPages || p.link, '', 'project-image'); preview.setAttribute('aria-label', `Abrir projeto ${p.name}`); preview.append(image(`assets/img/myProjects/${p.image}`, `Prévia do projeto ${p.name}`));
  const number = document.createElement('p'); number.className = 'project-number'; number.textContent = `0${index + 1} / PROJETO PESSOAL`;
  const h = document.createElement('h3'); h.textContent = p.name;
  const description = document.createElement('p'); description.textContent = descriptions[p.name];
  const actions = document.createElement('div'); actions.className = 'project-actions';
  if(p.linkGitHubPages) { const a = externalLink(p.linkGitHubPages, 'Ver projeto', 'text-link'); a.setAttribute('aria-label', `Ver projeto ${p.name}`); a.append(icon('arrow')); actions.append(a); }
  const code = externalLink(p.link, 'Código', 'text-link'); code.setAttribute('aria-label', `Código de ${p.name} no GitHub`); code.append(icon('github')); actions.append(code);
  card.append(preview, number, h, description, actions); $('#featured-projects').append(card);
}
for (const p of visibleProjects.filter(p => !['Seu Zé','Share'].includes(p.name))) {
  const a = externalLink(p.linkGitHubPages || p.link, '', 'project-row'); a.append(image(`assets/img/myProjects/${p.image}`, ''));
  const text = document.createElement('div'); const h = document.createElement('h3'); h.textContent = p.name; const d = document.createElement('p'); d.textContent = descriptions[p.name] || p.description; text.append(h,d); a.append(text, icon('arrow')); $('#more-projects').append(a);
}
const paths = { Frameworks: 'frameworks', Geradores: 'generators', 'Ícones': 'svgs', Softwares: 'softwares', 'Meu setup': 'products' };
const labels = { Frameworks: 'Para desenvolver', Geradores: 'Para criar', 'Ícones': 'Ícones e detalhes', Softwares: 'Ferramentas que uso', 'Meu setup': 'Meu setup' };
for (const [index, group] of collections.filter(c => c.name !== 'Projetos').entries()) {
  const details = document.createElement('details'); details.className = 'resource-group';
  const summary = document.createElement('summary'); const title = document.createElement('span'); title.className = 'resource-title';
  const number = document.createElement('span'); number.className = 'resource-index'; number.textContent = `0${index+1}`;
  const label = document.createElement('b'); label.textContent = labels[group.name]; title.append(number,label);
  const count = document.createElement('span'); count.className = 'resource-count'; count.textContent = `${group.items.length} links`;
  const plus = document.createElement('span'); plus.textContent = '+'; plus.setAttribute('aria-hidden','true'); summary.append(title,count,plus);
  const list = document.createElement('div'); list.className = 'resource-list';
  for (const item of group.items) { const a = externalLink(item.link, '', 'resource-link'); a.append(image(`assets/img/${paths[group.name]}/${item.image}`, '')); const text = document.createElement('span'); text.textContent = item.name; a.append(text,icon('arrow')); list.append(a); }
  details.append(summary,list); $('#resource-groups').append(details);
}

const updateProfilePages = initProfilePages(profiles, name => setProfile(name));
const profileNames = Object.keys(profiles);
// Capture the authored copy so leaving Gamer restores both other modes exactly.
const gamerCopy = {
  '#hero-role': 'Counter-Strike', '#hero-location': 'São Paulo / BR',
  '.hero h1 .heading-line:first-child > span': 'GL & HF. Eu sou',
  '.hero-contact .contact-button > span': 'Bora trocar uma call?',
  '.scroll-cue > span': 'Próximo round ↓',
  '#sobre .section-kicker > span': '01 / Player profile',
  '#projetos .section-kicker > span': '02 / Fora do servidor',
  '#projetos .section-heading p': 'Projetos no inventário. Pode inspecionar.',
  '#links .section-kicker > span': '03 / Loadout pessoal',
  '#links .section-heading p': 'Meu setup e as ferramentas que entram no round.',
  '.closing .eyebrow': 'A próxima call pode ser sua.',
  '.closing .contact-button > span': 'Chama no WhatsApp',
  '.intro-caption': 'Conectando ao lobby.',
  '.intro-counter': 'Player 01 — Eduardo José',
};
const regularCopy = Object.fromEntries(Object.keys(gamerCopy).map(selector=>[selector,$(selector).textContent]));
const businessCopy = {
  '#hero-role': 'Empresário & full stack', '#hero-location': 'São Paulo, Brasil',
  '.hero h1 .heading-line:first-child > span': 'Prazer,',
  '.hero-contact .contact-button > span': 'Vamos falar do seu projeto',
  '.scroll-cue > span': 'Conheça meu trabalho',
  '#sobre .section-kicker > span': '01 / Minha trajetória',
  '#projetos .section-kicker > span': '02 / Projetos selecionados',
  '#projetos .section-heading p': 'Uma seleção do que desenvolvo para a web.',
  '#links .section-kicker > span': '03 / Ferramentas de trabalho',
  '#links .section-heading p': 'Recursos que fazem parte do meu processo.',
  '.closing .eyebrow': 'Todo projeto começa com uma conversa.',
  '.closing .contact-button > span': 'Converse comigo',
  '.intro-caption': 'Ideias com intenção. Interfaces com cuidado.',
  '.intro-counter': 'Eduardo José / Desenvolvimento web',
};
const regularResourceLabels = [...document.querySelectorAll('.resource-title b')].map(el=>el.textContent);
const gamerResourceLabels = ['Stack de desenvolvimento','Utilitários do round','Ícones no inventário','Ferramentas de apoio','Meu loadout / Setup'];
const businessResourceLabels = ['Tecnologias','Recursos de criação','Bibliotecas de ícones','Ferramentas de produtividade','Estação de trabalho'];
const headingCopy = new Map();
function applyProfileCopy(name) {
  updateProfilePages(name);
  const variant = name==='gamer'?'gamer':name==='professional'?'business':'regular';
  for(const [selector,text] of Object.entries(variant==='gamer'?gamerCopy:variant==='business'?businessCopy:regularCopy)) $(selector).textContent=text;
  for(const [selector,copy] of headingCopy) {
    const heading=$(selector);
    const lines=heading.querySelectorAll(':scope > .heading-line > span');
    lines.forEach((line,index)=>line.innerHTML=copy[variant][index]);
  }
  document.querySelectorAll('.resource-title b').forEach((el,i)=>el.textContent=(variant==='gamer'?gamerResourceLabels:variant==='business'?businessResourceLabels:regularResourceLabels)[i]);
  document.querySelectorAll('.project-number').forEach((el,i)=>el.textContent=`0${i+1} / ${variant==='gamer'?'PROJETO NO INVENTÁRIO':variant==='business'?'DESENVOLVIMENTO WEB':'PROJETO PESSOAL'}`);
}
let currentProfile = 'casual';
let requestedProfile = currentProfile;
let profileRequest = 0;
// Decode all portraits before a gesture commits the next scene. Rapid gestures
// advance the requested profile; a slower earlier decode cannot overwrite it.
const portraitReady = new Map(Object.entries(profiles).map(([name,profile])=>{
  const asset = new Image(); asset.src = profile.photo;
  return [name,asset.decode().then(()=>true).catch(()=>false)];
}));
async function setProfile(name, announce = true, direction = 1) {
  if(!profiles[name]) return;
  requestedProfile = name;
  const request = ++profileRequest;
  if(announce) {
    const ready = await portraitReady.get(name);
    if(request !== profileRequest) return;
    if(!ready) { requestedProfile=currentProfile; $('#profile-status').textContent='Não foi possível carregar o retrato. Tente recarregar a página.'; return; }
  }
  const changed = name !== currentProfile;
  const photo = $('#profile-photo');
  const old = changed && !reducedMotion.matches ? capturePortrait(photo) : null;
  currentProfile = name; const p = profiles[name];
  root.dataset.profile = name;
  applyProfileCopy(name);
  $('#profile-description').textContent = p.description;
  $('#about-description').textContent = p.about;
  if(!photo.src.endsWith(p.photo)) photo.src = p.photo; photo.alt = p.alt;
  $('#personal-link').href = p.link; $('#personal-link').replaceChildren(document.createTextNode(p.label + ' '),icon('arrow'));
  $('meta[name="theme-color"]').content = p.color;
  $('#site-icon').href = `assets/brand/favicon-${name === 'professional' ? 'business' : name}.svg`;
  if(announce) history.replaceState(null,'',profileUrl(location.href,name));
  try { localStorage.setItem('eduardo-profile',name); } catch {}
  if(announce) $('#profile-status').textContent = `Perfil ${p.name} selecionado.`;
  if(old && announce) animatePortraitTransition(photo,old,direction,reducedMotion);
}
function stepProfile(direction) { setProfile(profileNames[(profileNames.indexOf(requestedProfile)+direction+profileNames.length)%profileNames.length],true,direction); }
$('#previous-profile').addEventListener('click',()=>stepProfile(-1)); $('#next-profile').addEventListener('click',()=>stepProfile(1));
const portrait = $('#portrait'); let drag = null;
portrait.addEventListener('pointerdown',event => { if(event.target.closest('button') || (event.pointerType === 'mouse' && event.button !== 0)) return; stopPortraitTransition(); drag={id:event.pointerId,x:event.clientX,y:event.clientY}; portrait.setPointerCapture(event.pointerId); });
portrait.addEventListener('pointermove',event => { if(!drag || drag.id!==event.pointerId) return; const x=event.clientX-drag.x,y=event.clientY-drag.y; if(Math.abs(y)>Math.abs(x) && Math.abs(y)>12) { cancelDrag(); return; } if(Math.abs(x)>8) { portrait.classList.add('dragging'); portrait.style.setProperty('--drag-x',`${Math.max(-50,Math.min(50,x*.35))}px`); } });
function cancelDrag() { if(drag && portrait.hasPointerCapture(drag.id)) portrait.releasePointerCapture(drag.id); drag=null; portrait.classList.remove('dragging'); portrait.style.removeProperty('--drag-x'); }
portrait.addEventListener('pointerup',event => { if(!drag) return; const dx=event.clientX-drag.x,dy=event.clientY-drag.y; cancelDrag(); if(Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)*1.3) stepProfile(dx<0?1:-1); });
portrait.addEventListener('pointercancel',cancelDrag); portrait.addEventListener('lostpointercapture',cancelDrag);
portrait.addEventListener('keydown',event=> { if(!['ArrowLeft','ArrowRight'].includes(event.key)) return; event.preventDefault(); stepProfile(event.key==='ArrowRight'?1:-1); });

// Keep content visible without JavaScript or when reduced motion is requested.
for (const heading of document.querySelectorAll('.content-shell h2')) {
  const lines = []; let line = document.createElement('span'); line.className='heading-line';
  const inner = document.createElement('span'); line.append(inner); lines.push(line);
  for(const node of [...heading.childNodes]) {
    if(node.nodeName==='BR') { line=document.createElement('span');line.className='heading-line';line.append(document.createElement('span'));lines.push(line); }
    else line.firstChild.append(node);
  }
  heading.replaceChildren(...lines); heading.classList.add('kinetic-heading');
}
for(const [selector,gamer] of Object.entries({
  '#sobre h2': ['Meu lado','no servidor<span>.</span>'],
  '#projetos h2': ['Entre rounds,','eu crio<span>.</span>'],
  '#links h2': ['Loadout pronto<span>.</span>','Bora pro jogo<span>?</span>'],
  '.closing h2': ['Bora fechar','esse lobby<span>?</span>'],
})) headingCopy.set(selector,{gamer,regular:[...$(selector).querySelectorAll(':scope > .heading-line > span')].map(el=>el.innerHTML)});
for(const [selector,business] of Object.entries({
  '#sobre h2': ['Empreender<span>.</span>','E construir soluções<span>.</span>'],
  '#projetos h2': ['Do conceito','à experiência<span>.</span>'],
  '#links h2': ['Um processo<span>.</span>','Boas ferramentas<span>.</span>'],
  '.closing h2': ['Sua próxima ideia','começa aqui<span>.</span>'],
})) headingCopy.get(selector).business=business;
updateProfilePages('casual');
let initialProfile = profileFromUrl(location.href);
if(!initialProfile) { try { const saved=localStorage.getItem('eduardo-profile'); if(profiles[saved]) initialProfile=saved; } catch {} }
setProfile(initialProfile || 'casual',false);
addEventListener('popstate',()=> { const mode=profileFromUrl(location.href); if(mode) setProfile(mode,false); });
if('IntersectionObserver' in window && !reducedMotion.matches) {
  root.classList.add('js');
  document.querySelectorAll('.project-card,.resource-group,.project-row').forEach((el,index)=>el.style.setProperty('--stagger',`${(index%3)*90}ms`));
  const observer=new IntersectionObserver(entries=> { for(const entry of entries) if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);} },{threshold:.12});
  document.querySelectorAll('.reveal,.kinetic-heading,.resource-group,.project-row').forEach(el=>observer.observe(el));
}
if(!reducedMotion.matches) {
  root.classList.add('intro-active');
  const photo = $('#profile-photo');
  const ready = photo.decode ? photo.decode().catch(()=>{}) : Promise.resolve();
  const entrance = new Promise(resolve=>setTimeout(resolve,{casual:1150,gamer:1350,professional:1050}[currentProfile]));
  Promise.all([entrance,Promise.race([ready,new Promise(resolve=>setTimeout(resolve,1700))])]).then(()=> {
    clearTimeout(window.introSafety); root.classList.add('intro-finished');
  });
}
$('#year').textContent=new Date().getFullYear();
// A restrained depth effect while the opening leaves the viewport.
let scrollFrame = 0;
function updatePortraitDepth() {
  scrollFrame = 0;
  const progress = Math.min(1,Math.max(0,window.scrollY/$('.hero').offsetHeight));
  const depth = reducedMotion.matches ? 0 : progress*65;
  portrait.style.setProperty('--portrait-depth', `${depth}px`);
  $('.portrait-backdrop').style.setProperty('--brush-depth',`${depth*-.5}px`);
  $('.hero-copy').style.setProperty('--copy-depth',`${depth*-.25}px`);
  for(const card of document.querySelectorAll('.project-card')) {
    const rect=card.getBoundingClientRect();
    if(rect.bottom>0 && rect.top<innerHeight) card.style.setProperty('--image-depth',`${reducedMotion.matches?0:Math.max(-12,Math.min(12,(innerHeight*.5-rect.top)*.035))}px`);
  }
}
addEventListener('scroll', () => { if(!scrollFrame) scrollFrame=requestAnimationFrame(updatePortraitDepth); }, {passive:true});
reducedMotion.addEventListener('change', updatePortraitDepth);
updatePortraitDepth();
let heroVisible = true;
function syncAmbientPlayback() {
  root.classList.toggle('ambient-paused',!heroVisible || document.hidden || reducedMotion.matches);
  if(reducedMotion.matches) stopPortraitTransition();
}
if('IntersectionObserver' in window) new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;syncAmbientPlayback();},{threshold:0}).observe($('.hero'));
document.addEventListener('visibilitychange',syncAmbientPlayback);
reducedMotion.addEventListener('change',syncAmbientPlayback);
syncAmbientPlayback();
initSectionNavigation();
initSceneMotion(reducedMotion);
let toastTimer; function toast(message) { $('#toast').textContent=message; $('#toast').classList.add('visible'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),3500); }
$('#share-button').addEventListener('click',async()=> { const data={title:'Eduardo José',text:'Três lados. A mesma pessoa.',url:shareProfileUrl(location.href,currentProfile)}; try { if(navigator.share){await navigator.share(data);}else if(navigator.clipboard){await navigator.clipboard.writeText(data.url);toast('Link deste perfil copiado. Obrigado por compartilhar!');}else{toast('Copie o endereço do navegador para compartilhar.');} }catch(error){if(error.name!=='AbortError') toast('Copie o endereço do navegador para compartilhar.');} });
