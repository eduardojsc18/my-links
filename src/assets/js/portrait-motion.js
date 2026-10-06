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
  const distance = Math.min(330, width * .72) * direction;
  const targetFilter = getComputedStyle(document.documentElement).getPropertyValue('--portrait-filter').trim();
  const options = {duration:850,easing:'cubic-bezier(.2,.8,.2,1)',fill:'both'};
  const depart = old.animate([
    {opacity:1,transform:`translate3d(0,${depth},0) rotate(0deg) scale(1)`},
    {opacity:.65,transform:`translate3d(${-distance*.48}px,${depth},0) rotate(${-direction*5}deg) scale(.95)`,offset:.45},
    {opacity:0,transform:`translate3d(${-distance}px,${depth},0) rotate(${-direction*9}deg) scale(.88)`},
  ],{...options,duration:650});
  const arrive = photo.animate([
    {opacity:0,transform:`translate3d(${distance}px,${depth},0) rotate(${direction*8}deg) scale(1.08)`,filter:targetFilter},
    {opacity:1,transform:`translate3d(${-direction*8}px,${depth},0) rotate(${-direction*.6}deg) scale(1)`,filter:targetFilter,offset:.8},
    {opacity:1,transform:`translate3d(0,${depth},0) rotate(0deg) scale(1)`,filter:targetFilter},
  ],options);
  effects.push(depart,arrive);
  const backdrop = document.querySelector('.portrait-backdrop');
  // Independent scale property composes with scroll depth and ambient rotation.
  effects.push(backdrop.animate([{scale:'.86',opacity:.15},{scale:'1.04',offset:.65},{scale:'1'}],options));
  for(const el of document.querySelectorAll('#profile-description,#about-description')) {
    effects.push(el.animate([{opacity:0,transform:`translateX(${direction*18}px)`},{opacity:1,transform:'translateX(0)'}],{duration:500,easing:'cubic-bezier(.22,1,.36,1)'}));
  }
  arrive.finished.then(()=> { if(run===generation) stopPortraitTransition(); }).catch(()=>{});
}
