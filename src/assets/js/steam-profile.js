const REFRESH_MS = 5 * 60 * 1000;
export function initSteamProfile() {
  const panel = document.querySelector('#steam-live');
  if (!panel) return;
  const status = panel.querySelector('[data-steam-status]');
  let lastAttempt = 0;
  let busy = false;
  let lastCheckedAt = null;
  const text = (name,value) => panel.querySelector(`[data-steam-${name}]`).textContent = value;
  const number = value => typeof value === 'number' && Number.isFinite(value) && value >= 0;
  const safeAsset = value => {try {const url=new URL(value);return url.protocol==='https:' && url.hostname.endsWith('.steamstatic.com') ? url.href : null;}catch {return null;}};
  async function refresh(force=false) {
    if (busy || document.hidden || document.documentElement.dataset.profile !== 'gamer' || (!force && Date.now()-lastAttempt < REFRESH_MS)) return;
    busy = true; lastAttempt = Date.now();
    panel.setAttribute('aria-busy','true');
    try {
      const endpoint = document.querySelector('meta[name="steam-endpoint"]')?.content || '/api/steam-profile';
      const response = await fetch(endpoint,{signal:AbortSignal.timeout(12000),cache:'no-store'});
      if (!response.ok) throw new Error('Unavailable');
      const data = await response.json();
      const time = new Date(data.checkedAt);
      if (!Number.isFinite(time.getTime()) || typeof data.name !== 'string') throw new Error('Invalid data');
      lastCheckedAt = time;
      text('name',data.name);
      text('hours',number(data.totalHours)?`${data.totalHours.toLocaleString('pt-BR')} h`:'—');
      text('recent',number(data.recentHours)?`${data.recentHours.toLocaleString('pt-BR',{maximumFractionDigits:1})} h`:'—');
      text('presence',({'online':'Online','offline':'Offline','in-game':'Em jogo'})[data.state] || 'Perfil público');
      const avatar = safeAsset(data.avatar);
      if (avatar) {const img=panel.querySelector('[data-steam-avatar]');img.src=avatar;img.hidden=false;}
      const gameImage = safeAsset(data.gameImage);
      if(gameImage) panel.querySelector('.steam-game-art').src=gameImage;
      status.textContent=`${data.stale?'Última consulta disponível':'Steam atualizada'} · ${time.toLocaleDateString('pt-BR')} às ${time.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}${data.stale?' · tentando novamente em breve':''}${number(data.totalHours)?'':' · tempo de jogo não disponibilizado nesta consulta'}`;
      panel.dataset.state=data.stale?'stale':'ready';
    } catch {
      const usable = lastCheckedAt && Date.now()-lastCheckedAt.getTime() < 24*60*60*1000;
      if (!usable) {text('hours','—');text('recent','—');text('presence','Perfil público');}
      status.textContent=usable?`Steam indisponível agora · última consulta em ${lastCheckedAt.toLocaleDateString('pt-BR')} às ${lastCheckedAt.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}`:'Não foi possível consultar a Steam agora. Você pode abrir meu perfil abaixo.';
      panel.dataset.state='stale';
    } finally {busy=false;panel.setAttribute('aria-busy','false');}
  }
  new MutationObserver(()=>refresh()).observe(document.documentElement,{attributes:true,attributeFilter:['data-profile']});
  document.addEventListener('visibilitychange',()=>refresh());
  setInterval(()=>refresh(),REFRESH_MS);
  panel.querySelector('[data-steam-refresh]').addEventListener('click',()=>refresh(true));
  refresh();
}
