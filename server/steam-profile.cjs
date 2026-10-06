// Only Eduardo's public Steam profile is queried. No user-controlled URLs or IDs.
const STEAM_ID = '76561198417623600';
const PROFILE_URL = 'https://steamcommunity.com/id/rvermeio/';
const FRESH_MS = 5 * 60 * 1000;
const STALE_MS = 24 * 60 * 60 * 1000;
let cache = null;
let pending = null;
let retryAt = 0;

function tag(xml, name) {
  const raw = xml.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`))?.[1] ?? '';
  return raw.replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/, '$1').trim();
}
function asset(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname.endsWith('.steamstatic.com') ? url.href : null;
  } catch { return null; }
}
function hours(value) {
  if (!/^\d[\d,]*(?:\.\d+)?$/.test(value)) return null;
  const number = Number(value.replaceAll(',', ''));
  return Number.isFinite(number) && number >= 0 ? number : null;
}
function parseProfile(xml, now = new Date().toISOString()) {
  if (!xml.includes('<profile>') || tag(xml, 'steamID64') !== STEAM_ID || tag(xml, 'privacyState') !== 'public') throw new Error('Profile unavailable');
  const game = [...xml.matchAll(/<mostPlayedGame>([\s\S]*?)<\/mostPlayedGame>/g)].map(match=>match[1]).find(value=>tag(value,'gameLink') === 'https://steamcommunity.com/app/730');
  return {
    name: tag(xml, 'steamID').slice(0, 80), avatar: asset(tag(xml, 'avatarFull')),
    totalHours: game ? hours(tag(game, 'hoursOnRecord')) : null,
    recentHours: game ? hours(tag(game, 'hoursPlayed')) : null,
    gameImage: game ? asset(tag(game, 'gameLogo')) : null,
    state: ['online','offline','in-game'].includes(tag(xml,'onlineState')) ? tag(xml,'onlineState') : null,
    profileUrl: PROFILE_URL, checkedAt: now,
  };
}
async function getSteamProfile() {
  const now = Date.now();
  if (cache && now - cache.time < FRESH_MS) return {...cache.data, stale:false};
  if (!pending && now >= retryAt) {
    pending = (async()=>{
      const response = await fetch(PROFILE_URL + '?xml=1', {signal:AbortSignal.timeout(8000),headers:{'Accept':'application/xml','User-Agent':'EduardoPortfolio/1.0'}});
      if (!response.ok) throw new Error('Steam unavailable');
      const xml = await response.text();
      if (xml.length > 200000) throw new Error('Invalid response');
      const data = parseProfile(xml);
      cache = {data,time:Date.now()}; retryAt = 0;
      return {...data, stale:false};
    })().catch(error=>{retryAt=Date.now()+60000;throw error;}).finally(()=>{pending=null;});
  }
  try { if (pending) return await pending; } catch {}
  if (cache && now - cache.time < STALE_MS) return {...cache.data,stale:true};
  throw new Error('Steam temporarily unavailable');
}
module.exports = {getSteamProfile,parseProfile};
