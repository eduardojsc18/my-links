export function initSceneMotion(reducedMotion) {
  const sections = [...document.querySelectorAll('.content-shell > .section')];
  const root = document.documentElement;
  for (const section of sections) {
    const transition = document.createElement('div');
    transition.className = 'scene-transition';
    transition.setAttribute('aria-hidden', 'true');
    transition.innerHTML = '<i class="transition-shape"></i><i class="transition-line"></i><i class="transition-detail"></i>';
    section.prepend(transition);
  }
  const entries = new Map();
  const targets = sections.flatMap(section => [...section.querySelectorAll('.section-kicker,.section-heading,.about-grid h2,.about-grid > div,.project-card,.resource-group,.closing .eyebrow,.closing h2,.closing .contact-button,.profile-list article,.product-stories article,.career-list li,.hardware-grid > div,.mode-options button')]);
  function enter(el) {
    entries.get(el)?.cancel();
    if (reducedMotion.matches || typeof el.animate !== 'function') return;
    const mode = root.dataset.profile;
    const frames = mode === 'gamer' ? [
      {opacity:.15,transform:'translateX(-28px)',clipPath:'inset(0 18% 0 0)'},
      {opacity:1,transform:'translateX(0)',clipPath:'inset(0)'},
    ] : mode === 'professional' ? [
      {opacity:0,transform:'translateY(24px)',clipPath:'inset(0 0 18% 0)'},
      {opacity:1,transform:'translateY(0)',clipPath:'inset(0)'},
    ] : [
      {opacity:0,transform:'translateY(42px) rotate(1deg) scale(.98)'},
      {opacity:1,transform:'translateY(-3px) rotate(-.15deg) scale(1)',offset:.8},
      {opacity:1,transform:'translateY(0) rotate(0) scale(1)'},
    ];
    const index = targets.indexOf(el);
    // Keep mode selectors stationary so entrance motion never shifts a tap target.
    const entryFrames = el.matches('.mode-options button') ? [{opacity:0},{opacity:1}] : frames;
    const effect = el.animate(entryFrames,{duration:mode==='gamer'?650:mode==='professional'?1000:950,delay:(index%3)*65,easing:mode==='gamer'?'cubic-bezier(.16,1,.3,1)':'cubic-bezier(.22,1,.36,1)',fill:'backwards'});
    entries.set(el,effect);
    effect.finished.then(()=>{if(entries.get(el)===effect) entries.delete(el);}).catch(()=>{});
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(items => {
      for (const item of items) {
        if(item.isIntersecting) enter(item.target);
        else { entries.get(item.target)?.cancel(); entries.delete(item.target); }
      }
    },{threshold:.16});
    targets.forEach(el=>observer.observe(el));
  }
  let frame = 0;
  function render() {
    frame = 0;
    const height = innerHeight;
    for (const section of sections) {
      if (section.hidden) continue;
      // Measure content with the normal symmetrical padding. Including the
      // extra exit buffer here would keep collapsed accordions permanently tall.
      const padding = parseFloat(getComputedStyle(section).paddingTop);
      const tall = section.querySelector('.scene-content').offsetHeight + padding * 2 + 1 > height + 2;
      section.classList.toggle('is-tall', tall);
      const rect = section.getBoundingClientRect();
      // Decorative handoff peaks while the next scene crosses the viewport,
      // including oversized sections; it disappears at the reading position.
      const passage = Math.max(0,Math.min(1,rect.top >= 0 ? rect.top / height : rect.bottom < height ? rect.bottom / height : 0));
      const transitionTop = Math.min(Math.max(0,-rect.top),Math.max(0,section.offsetHeight-Math.min(height*.38,300)));
      section.style.setProperty('--transition-top', `${transitionTop}px`);
      section.style.setProperty('--handoff', `${reducedMotion.matches?0:Math.sin(passage*Math.PI)}`);
      section.style.setProperty('--handoff-y', `${(1-passage)*-90}px`);
      section.style.setProperty('--handoff-x', `${(1-passage)*100}%`);
      section.style.setProperty('--handoff-turn', `${(1-passage)*35}deg`);
      if (reducedMotion.matches || tall) {
        section.style.setProperty('--scene-shift', '0px');
        section.style.setProperty('--scene-scale', '1');
        section.style.setProperty('--scene-opacity', '1');
        section.style.setProperty('--scene-line', '1');
        continue;
      }
      // At the resting snap position, everything is sharp and still. Motion
      // follows the finger in either direction without taking over scrolling.
      const distance = Math.max(-1, Math.min(1, rect.top / height));
      const travel = Math.abs(distance);
      section.style.setProperty('--scene-shift', `${distance * 34}px`);
      section.style.setProperty('--scene-scale', `${1 - travel * .018}`);
      section.style.setProperty('--scene-opacity', `${1 - travel * .4}`);
      section.style.setProperty('--scene-line', `${1 - travel * .45}`);
    }
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(render); }
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', schedule);
  reducedMotion.addEventListener('change', schedule);
  reducedMotion.addEventListener('change',()=>{entries.forEach(effect=>effect.cancel());entries.clear();});
  new MutationObserver(()=>{
    entries.forEach(effect=>effect.cancel()); entries.clear(); schedule();
  }).observe(root,{attributes:true,attributeFilter:['data-profile']});
  // Expanding resources and changing profiles can turn a slide into a long
  // section. ResizeObserver updates the behavior without fixed-height clipping.
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(schedule);
    sections.forEach(section => observer.observe(section));
  }
  render();
}
