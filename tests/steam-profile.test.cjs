const {test} = require('node:test');
const assert = require('node:assert/strict');
const {parseProfile,getSteamProfile} = require('../server/steam-profile.cjs');
const xml = `<profile><steamID64>76561198417623600</steamID64><steamID><![CDATA[Vermeio]]></steamID><privacyState>public</privacyState><onlineState>online</onlineState><avatarFull><![CDATA[https://avatars.fastly.steamstatic.com/avatar_full.jpg]]></avatarFull><mostPlayedGames><mostPlayedGame><gameLink><![CDATA[https://steamcommunity.com/app/730]]></gameLink><hoursOnRecord>5,703</hoursOnRecord><hoursPlayed>4.8</hoursPlayed></mostPlayedGame></mostPlayedGames></profile>`;
test('Steam identity, hours and safe assets are normalized',()=>{
  const data=parseProfile(xml,'2026-10-06T20:00:00.000Z');
  assert.equal(data.name,'Vermeio');assert.equal(data.totalHours,5703);assert.equal(data.recentHours,4.8);
  assert.equal(data.checkedAt,'2026-10-06T20:00:00.000Z');
  assert.equal(parseProfile(xml.replace('https://avatars.fastly.steamstatic.com/avatar_full.jpg','https://example.com/avatar.jpg')).avatar,null);
});
test('Private, wrong-account and missing game data are never shown as zero',()=>{
  assert.throws(()=>parseProfile(xml.replace('public','private')));
  assert.throws(()=>parseProfile(xml.replace('76561198417623600','123')));
  assert.throws(()=>parseProfile('<html>Sign in</html>'));
  const missing=parseProfile(xml.replace('https://steamcommunity.com/app/730','https://steamcommunity.com/app/999'));
  assert.equal(missing.totalHours,null);assert.equal(missing.recentHours,null);
});
test('Concurrent refreshes share one request, cache expires and outages preserve original timestamp',async()=>{
  const originalFetch=global.fetch,originalNow=Date.now;
  let now=originalNow(),calls=0;
  Date.now=()=>now;
  global.fetch=async()=>{calls++;return {ok:true,text:async()=>xml};};
  try {
    const results=await Promise.all([getSteamProfile(),getSteamProfile(),getSteamProfile()]);
    assert.equal(calls,1);assert.equal(results[0].stale,false);
    await getSteamProfile();assert.equal(calls,1);
    now+=6*60*1000;
    global.fetch=async()=>{calls++;throw new Error('429');};
    const stale=await getSteamProfile();
    assert.equal(stale.stale,true);assert.equal(stale.checkedAt,results[0].checkedAt);
    await getSteamProfile();assert.equal(calls,2);
    now+=25*60*60*1000;
    await assert.rejects(getSteamProfile());
  } finally {global.fetch=originalFetch;Date.now=originalNow;}
});
