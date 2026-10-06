const aliases = Object.freeze({casual:'casual', gamer:'gamer', business:'professional', professional:'professional'});

export function profileFromUrl(href) {
  try { const value=new URL(href).searchParams.get('perfil')?.trim().toLowerCase(); return Object.hasOwn(aliases,value) ? aliases[value] : null; }
  catch { return null; }
}

export function profileUrl(href, profile) {
  const url = new URL(href);
  url.searchParams.set('perfil', profile === 'professional' ? 'business' : profile);
  return url;
}

export function shareProfileUrl(href, profile) {
  const url = profileUrl(href, profile);
  url.hash = '';
  return url.href;
}
