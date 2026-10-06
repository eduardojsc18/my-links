// Follow the visible story for the selected mode, including sections that grow.
export function initSectionNavigation() {
  const root=document.documentElement;
  const sections=[document.querySelector('#inicio'),...document.querySelectorAll('.content-shell > .section')];
  const controls=new Map();
  sections[0].tabIndex=-1;
  for(const section of sections.slice(1)) {
    const nav=document.createElement('nav');
    nav.className='section-navigation';
    nav.setAttribute('aria-label','Navegação entre seções');
    nav.innerHTML='<a class="section-previous"><svg aria-hidden="true"><use href="#down"/></svg><span>Anterior</span></a><span class="section-progress" aria-hidden="true"></span><a class="section-next"><span>Próxima</span><svg aria-hidden="true"><use href="#down"/></svg></a>';
    section.querySelector('.scene-content').append(nav);
    section.tabIndex=-1;
    controls.set(section,nav);
  }
  function update() {
    const visible=sections.filter(section=>!section.hidden);
    visible.forEach((section,index)=>{
      const nav=controls.get(section);
      if(!nav) return;
      const previous=visible[index-1];
      const next=visible[index+1] || visible[0];
      const priorLink=nav.querySelector('.section-previous');
      const nextLink=nav.querySelector('.section-next');
      priorLink.href=`#${previous.id}`;
      nextLink.href=`#${next.id}`;
      nextLink.querySelector('span').textContent=index===visible.length-1?'Início':'Próxima';
      nextLink.classList.toggle('returns-to-start',index===visible.length-1);
      const name=target=>target.id==='inicio'?'apresentação':[...target.querySelectorAll('h2 > .heading-line')].map(line=>line.textContent.trim()).join(' ');
      priorLink.setAttribute('aria-label',`Seção anterior: ${name(previous)}`);
      nextLink.setAttribute('aria-label',`${index===visible.length-1?'Voltar ao início':'Próxima seção'}: ${name(next)}`);
      nav.querySelector('.section-progress').textContent=`${String(index).padStart(2,'0')} / ${String(visible.length-1).padStart(2,'0')}`;
    });
  }
  new MutationObserver(update).observe(root,{attributes:true,attributeFilter:['data-profile']});
  update();
}
