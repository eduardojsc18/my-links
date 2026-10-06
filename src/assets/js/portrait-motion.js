// A single transition owns its temporary layers. Interrupting a gesture or
// switching again cancels all effects and removes the outgoing image.
let effects = [];
let outgoing = null;
let generation = 0;

export function stopPortraitTransition() {
  generation++;
  effects.forEach(effect => effect.cancel());
  effects = [];
  outgoing?.remove();
  outgoing = null;
  document.querySelector('#portrait')?.classList.remove('is-switching');
}

export function capturePortrait(photo) {
  stopPortraitTransition();
  const old = photo.cloneNode(false);
  old.removeAttribute('id');
  old.removeAttribute('fetchpriority');
  old.removeAttribute('tabindex');
  old.alt = '';
  old.setAttribute('aria-hidden', 'true');
  old.className = 'portrait-outgoing';
  old.style.filter = getComputedStyle(photo).filter;
  old.style.transition = 'none';
  old.dataset.baseColor = getComputedStyle(document.body).backgroundColor;
  return old;
}

export function animatePortraitTransition(photo, old, direction, reducedMotion) {
  if(reducedMotion.matches || typeof photo.animate !== 'function') return;
  const parent = photo.parentElement;
  const run = ++generation;
  outgoing = old;
  parent.append(old);
  parent.classList.add('is-switching');
  const depth = getComputedStyle(parent).getPropertyValue('--portrait-depth').trim() || '0px';
  const width = parent.getBoundingClientRect().width;
  const mode=document.documentElement.dataset.profile;
  const distance = Math.min(190, width * .42) * direction;
  const tilt=mode==='gamer'?0:mode==='professional'?1.5:4;
  const reveal=direction>0?'inset(0 0 0 100%)':'inset(0 100% 0 0)';
  const targetFilter = getComputedStyle(document.documentElement).getPropertyValue('--portrait-filter').trim();
  const options = {duration:mode==='gamer'?720:900,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'};
  const depart = old.animate([
    {opacity:1,transform:`translate3d(0,${depth},0) rotate(0deg) scale(1)`},
    {opacity:.6,transform:`translate3d(${-distance*.35}px,${depth},0) rotate(${-direction*tilt}deg) scale(.97)`,offset:.4},
    {opacity:0,transform:`translate3d(${-distance}px,${depth},0) rotate(${-direction*tilt*1.5}deg) scale(.94)`},
  ],{...options,duration:560});
  const arrive = photo.animate([
    {opacity:.4,clipPath:reveal,transform:`translate3d(${distance*.65}px,${depth},0) rotate(${direction*tilt}deg) scale(1.045)`,filter:targetFilter},
    {opacity:1,clipPath:'inset(0)',transform:`translate3d(${-direction*6}px,${depth},0) rotate(${-direction*tilt*.1}deg) scale(1.012)`,filter:targetFilter,offset:.65},
    {opacity:1,clipPath:'inset(0)',transform:`translate3d(0,${depth},0) rotate(0deg) scale(1)`,filter:targetFilter},
  ],options);
  effects.push(depart,arrive);
  if(matchMedia('(max-width:700px)').matches) {
    const contact = document.querySelector('.hero-contact');
    const base = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
    // The contact gradient and page must interpolate the same colors together.
    effects.push(document.body.animate([
      {backgroundColor:old.dataset.baseColor},{backgroundColor:base}
    ],options));
    effects.push(contact.animate([
      {opacity:0,translate:'0 32px','--contact-base':old.dataset.baseColor},
      {opacity:1,translate:'0 5px',offset:.72},
      {opacity:1,translate:'0 0','--contact-base':base}
    ],options));
  }
  const arrow=parent.querySelector(direction>0?'.next svg':'.previous svg');
  if(arrow) effects.push(arrow.animate([{translate:'0',scale:'.85'},{translate:`${direction*5}px 0`,scale:'1.12',offset:.35},{translate:'0',scale:'1'}],{duration:450,easing:options.easing}));
  const backdrop = document.querySelector('.portrait-backdrop');
  // Independent scale property composes with scroll depth and ambient rotation.
  effects.push(backdrop.animate([{scale:'.86',opacity:.15},{scale:'1.04',offset:.65},{scale:'1'}],options));
  for(const el of document.querySelectorAll('#profile-description,#about-description')) {
    effects.push(el.animate([{opacity:0,transform:`translateX(${direction*18}px)`},{opacity:1,transform:'translateX(0)'}],{duration:500,easing:'cubic-bezier(.22,1,.36,1)'}));
  }
  arrive.finished.then(()=> { if(run===generation) stopPortraitTransition(); }).catch(()=>{});
}
