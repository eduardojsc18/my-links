import {uiIcon} from './ui-icons.js';
import {initSteamProfile} from './steam-profile.js';
// Editorial content from Eduardo, his CV, public Steam and local hardware.
export const setup = [
  ['CPU','AMD Ryzen 5 3600X','6 núcleos · 12 threads'],
  ['GPU','GeForce RTX 3060 Ti','8 GB de VRAM'],
  ['RAM','32 GB A-DATA','4 × 8 GB · 2666 MT/s'],
  ['PLACA-MÃE','Gigabyte B450M AORUS ELITE','Plataforma AM4'],
  ['SSD','Kingston A400 · 480 GB','SATA · cerca de 447 GiB'],
  ['HD','WD Blue · 1 TB','SATA · cerca de 932 GiB'],
];
const link = (url,label) => `<a class="text-link" href="${url}" target="_blank" rel="noopener noreferrer">${label} <span aria-hidden="true">↗</span></a>`;
const chips = values => `<div class="profile-chips">${values.map(v=>`<span>${v}</span>`).join('')}</div>`;
const sectionIcons = {'gamer-steam':'steam','gamer-historia':'trophy','gamer-jogos':'controller','gamer-loadout':'layers','gamer-pc':'cpu','business-agora':'case','business-criacoes':'layers'};
const section = (id,mode,kicker,title,content) => `<section class="section profile-section" id="${id}" data-modes="${mode}" hidden><div class="scene-content"><div class="section-kicker">${uiIcon(sectionIcons[id] || 'layers')}<span>${kicker}</span><i></i></div><div class="section-heading"><h2>${title}</h2></div>${content}</div></section>`;
export function initProfilePages(profiles,onSelect) {
  const gaming = section('gamer-historia','gamer','02 / De onde veio o player','Do 1.6<br>ao CS2.',`
    <div class="rank-memento">${uiIcon('trophy')}<span><strong>Global no CS:GO</strong><small>Uma conquista da minha história</small></span></div>
    <p class="profile-body">Jogo Counter-Strike desde o 1.6. No CS:GO cheguei à Global e hoje sigo no CS2 — meu jogo casual para fechar o dia.</p>
    <p class="profile-body">Não tenho posição ou mapa favorito. Vou onde o round precisar. E, pela minha sanidade, o time inimigo fica mutado.</p>
    ${link('https://steamcommunity.com/id/rvermeio/','Me encontra na Steam')}`)
    + section('gamer-steam','gamer','03 / Meu perfil na Steam','Vermeio.<br>No lobby.',`
    <div class="steam-live" id="steam-live" aria-busy="true">
      <div class="steam-card-header">${uiIcon('steam')}<span>STEAM / PLAYER CARD</span><button type="button" data-steam-refresh aria-label="Atualizar dados da Steam">↻</button></div>
      <div class="steam-identity"><img data-steam-avatar hidden alt="Avatar público de Vermeio na Steam" width="56" height="56"><div><h3 data-steam-name>Vermeio</h3><span data-steam-presence>Consultando perfil…</span></div><img class="steam-game-art" src="https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/730/942c04efaa5bc87afb6f2a97dbf17ac614c8a84d/capsule_184x69.jpg?t=1789251637" alt="Counter-Strike 2" width="184" height="69" loading="lazy"></div>
      <div class="profile-stats"><div><strong data-steam-hours>—</strong><span>CS:GO + CS2 · horas totais</span></div><div><strong data-steam-recent>—</strong><span>CS2 · atividade recente</span></div></div>
      <p class="profile-note" data-steam-status role="status" aria-live="polite">Consultando a Steam…</p>
    </div>
    <div class="profile-link-row">${link('https://steamcommunity.com/id/rvermeio/','Me adiciona na Steam')}${link('https://csrep.gg/player/76561198417623600','Meu painel no CSREP')}</div>
    <p class="profile-note">K/D, ADR e partidas estão no meu painel do CSREP. A Global acima é do CS:GO.</p>`)
    + section('gamer-jogos','gamer','04 / Além do competitivo','Outros jogos.<br>Boas memórias.',`
    <div class="profile-list game-library"><article><div class="game-art minecraft-art" aria-hidden="true">${uiIcon('cube')}<span>MINECRAFT</span></div><span>01 / CONSTRUÇÃO</span><h3>Minecraft</h3><p>Também passei bastante tempo fora dos rounds, construindo em blocos.</p></article><article><div class="game-art overwatch-art" aria-hidden="true">${uiIcon('overwatch')}<span>OVERWATCH</span></div><span>02 / EQUIPE</span><h3>Overwatch</h3><p>Outro jogo que fez parte da minha história.</p></article><article><div class="game-art racing-art" aria-hidden="true">${uiIcon('race')}<span>MOST WANTED</span></div><span>03 / CORRIDA</span><h3>Need for Speed: Most Wanted</h3><p>Entre as corridas que marcaram minha trajetória.</p></article></div>
    <p class="profile-body">Sou mais PC. Nos consoles, minha história passou pelo Nintendo 64 e pelo PlayStation 2.</p>
    ${chips(['PC primeiro','Nintendo 64','PlayStation 2'])}`)
    + section('gamer-loadout','gamer','05 / Loadout & canais','Meu inventário.<br>Meu lobby.',`
    <div class="profile-list"><article><div class="channel-mark">${uiIcon('steam')}</div><span>STEAM / RVERMEIO</span><h3>Skins no inventário</h3><p>O inventário da Steam é o lugar para inspecionar minhas skins e o loadout atual.</p>${link('https://steamcommunity.com/id/rvermeio/inventory/','Inspecionar inventário')}</article><article><div class="channel-mark">${uiIcon('twitch')}</div><span>TWITCH / RVERMEIO</span><h3>A live que ficou para depois</h3><p>Já tentei começar na Twitch, mas nunca mantive uma sequência. O canal continua por lá.</p>${link('https://www.twitch.tv/rvermeio','Conhecer meu canal')}</article></div>`)
    + section('gamer-pc','gamer','06 / Meu setup','A máquina<br>por trás do round.',`
    <dl class="hardware-grid">${setup.map(([type,name,detail])=>`<div><dt>${uiIcon('cpu')}${type}</dt><dd>${name}<small>${detail}</small></dd></div>`).join('')}</dl><p class="profile-note">Configuração coletada neste PC em 06/10/2026. Capacidades comerciais e utilizáveis indicadas separadamente.</p>`);
  const business = section('business-agora','professional','02 / Hoje','Código, produto<br>e operação.',`
    <p class="profile-body">Hoje sou dono da minha empresa. Desenvolvo sistemas e atuo no e-commerce com produtos de múltiplos nichos, em canais como TikTok Shop, Mercado Livre e Shopee.</p><p class="profile-body">Essa rotina aproxima meu desenvolvimento dos problemas reais da operação: vendas, estoque, integrações e expedição. É daí que nascem minhas soluções.</p>
    ${chips(['Desenvolvimento full stack','E-commerce','Integrações de APIs','Produtos próprios'])}`)
    + section('business-criacoes','professional','03 / Produtos que desenvolvo','Da necessidade<br>ao sistema.',`
    <div class="product-stories"><article><span>WEB / EM EVOLUÇÃO</span><h3 class="app-title"><img src="assets/img/apps/farol.png" alt="" width="44" height="44" loading="lazy">FAROL</h3><p>Um sistema de gestão para acompanhar e operar o e-commerce, em constante crescimento.</p>${chips(['Nuxt 4','Vue 3','TypeScript','Supabase / PostgreSQL','Pinia','Vuetify'])}<ul><li>Integrações com Mercado Livre e TikTok Shop para vendas, produtos e atendimento.</li><li>Filas de sincronização e processamento em segundo plano, com acompanhamento da execução.</li><li>Relatórios de vendas, curva ABC, gestão de estoque e análise financeira.</li><li>Produto Master, expedição e geração de etiquetas em PDF.</li></ul></article>
    <article><span>DESKTOP / MINHA CRIAÇÃO MAIS RECENTE</span><h3 class="app-title"><img src="assets/img/apps/printpilot.png" alt="" width="44" height="44" loading="lazy">PrintPilot</h3><p>Aplicativo de impressão para Windows, pensado para reduzir o trabalho manual com etiquetas.</p>${chips(['C#','.NET 10','WPF','PDFsharp','Labelary','Spooler do Windows'])}<ul><li>Monitoramento de pastas e leitura de TXT, ZPL, ZIP e PDFs.</li><li>Conversão de ZPL, prévia da folha e composição de etiqueta com NF-e.</li><li>Impressão contínua em um único trabalho, usando as configurações do driver.</li><li>Fila, histórico local persistente e atualizações com verificação de integridade.</li></ul>${link('https://github.com/eduardojsc18/PrintPilot-App/releases','Conhecer o PrintPilot')}</article></div>`)
    + section('business-trajetoria','professional','04 / Experiência','Uma trajetória<br>em tecnologia.',`
    <ol class="career-list"><li><span>ATUAL</span><h3>Empresário & desenvolvedor</h3><p>Sistemas próprios e operação de e-commerce em múltiplos canais.</p></li><li><span>2024 — PRESENTE · CURRÍCULO</span><h3>Integrações com Mercado Livre</h3><p>Gestão de vendas e estoque via API, com Nuxt, Tailwind CSS e Supabase.</p></li><li><span>2024 — 2025</span><h3>Plataforma de lojas</h3><p>Presença digital para importadoras, com Nuxt, Tailwind CSS e Laravel.</p></li><li><span>2023 — 2025</span><h3>CRM para seguradora</h3><p>Gerenciamento de leads e funil de vendas com Vue, Inertia, Laravel e Tailwind CSS.</p></li><li><span>2021 — 2025</span><h3>ERP para importadora</h3><p>Vendas, estoque, atendimentos, pedidos e integrações de APIs.</p></li><li><span>2019 — 2021</span><h3>Certisign · Analista de suporte</h3><p>Suporte a certificados digitais ICP-Brasil, atendimento com Oracle RightNow e Portal de Assinaturas.</p></li></ol>`)
    + section('business-formacao','professional','05 / Formação & ferramentas','Aprender.<br>Construir. Evoluir.',`
    <div class="profile-list"><article><span>2016 — 2018</span><h3>Análise e Desenvolvimento de Sistemas</h3><p>Universidade Nove de Julho</p></article><article><span>2011 — 2012</span><h3>Informática para Internet</h3><p>ETEC Santa Isabel</p></article><article><span>FORMAÇÃO CONTÍNUA</span><h3>Desenvolvimento web full stack</h3><p>Cursos, imersões e leitura de documentação.</p></article></div>
    ${chips(['JavaScript','TypeScript','HTML / CSS','PHP','SQL','Vue / Nuxt','Laravel','Tailwind CSS','Git / GitHub'])}<p class="profile-note">Português fluente · Inglês A2, conforme currículo.</p>${link('https://br.linkedin.com/in/eduardojsc','Meu LinkedIn')}`);
  document.querySelector('#sobre').insertAdjacentHTML('afterend',gaming+business);
  document.querySelectorAll('#projetos,#links').forEach(el=>el.dataset.modes='casual');
  const discovery = document.createElement('section');
  discovery.className='section mode-discovery'; discovery.id='outros-lados';
  discovery.innerHTML=`<div class="scene-content"><div class="section-kicker"><span>CONTINUE EXPLORANDO</span><i></i></div><div class="discovery-intro"><h2>Três lados.<br>A mesma pessoa.</h2><p>Tem mais de mim por aqui.<br>Escolha o próximo lado para conhecer.</p></div><div class="mode-options">${Object.entries(profiles).map(([key,p],index)=>`<button type="button" data-select-profile="${key}" aria-label="Conhecer meu lado ${p.name}"><span class="mode-card-copy"><span class="mode-card-label">0${index+1} / ${key==='gamer'?'FORA DO TRABALHO':key==='professional'?'IDEIAS EM PRÁTICA':'ALÉM DA TELA'}</span><b>${p.name}</b><small>${key==='gamer'?'Do CS 1.6 ao CS2. Histórias, jogos e meu setup.':key==='professional'?'Minha trajetória e os sistemas que eu construo.':'Um pouco de quem eu sou, sem roteiro.'}</small><span class="mode-card-action">Conhecer <svg aria-hidden="true"><use href="#arrow"/></svg></span></span><span class="mode-card-art" aria-hidden="true"><span class="mode-card-orbit"></span><img src="${p.photo}" alt="" width="1254" height="1254" loading="lazy"></span></button>`).join('')}</div></div>`;
  document.querySelector('.content-shell').append(discovery);
  discovery.addEventListener('click',async event=>{
    const button=event.target.closest('[data-select-profile]'); if(!button) return;
    await onSelect(button.dataset.selectProfile);
    // Let section visibility and tall-panel measurements settle before returning
    // to the opening. Scroll anchoring must not keep the previous footer in view.
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    document.querySelector('#inicio').scrollIntoView({behavior:'instant'});
    document.querySelector('.signature').focus({preventScroll:true});
    history.replaceState(null,'','#inicio');
  });
  initSteamProfile();
  const originalTags=document.querySelector('.tech-list').innerHTML;
  return name=>{
    document.querySelector('.menu-link').setAttribute('aria-label',name==='gamer'?'Explorar meu lado Gamer':name==='professional'?'Explorar minha trajetória profissional':'Explorar projetos e links');
    document.querySelectorAll('[data-modes]').forEach(el=>el.hidden=!el.dataset.modes.split(' ').includes(name));
    discovery.querySelectorAll('[data-select-profile]').forEach(el=>el.hidden=el.dataset.selectProfile===name);
    document.querySelector('.tech-list').innerHTML=name==='gamer'?'<span>CS desde o 1.6</span><span>PC gamer</span>':name==='professional'?'<span>Full stack</span><span>Empresário</span>':originalTags;
    const socials=document.querySelectorAll('.hero-contact .social-links a');
    const urls=name==='gamer'?['https://steamcommunity.com/id/rvermeio/','https://www.twitch.tv/rvermeio']:['https://github.com/eduardojsc18','https://br.linkedin.com/in/eduardojsc'];
    const labels=name==='gamer'?['Steam','Twitch']:['GitHub','LinkedIn'];
    socials.forEach((el,index)=>{el.href=urls[index];el.lastChild.textContent=labels[index];const svg=el.querySelector('svg');svg.style.display='';svg.setAttribute('viewBox','0 0 24 24');if(name==='gamer'){svg.innerHTML=uiIcon(index===0?'steam':'twitch').match(/<svg[^>]*>([\s\S]*)<\/svg>/)[1];}else{svg.innerHTML=`<use href="#${index===0?'github':'linkedin'}"/>`;}});
  };
}
