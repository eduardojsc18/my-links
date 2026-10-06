const {getSteamProfile} = require('../../server/steam-profile.cjs');
exports.handler = async event => {
  const headers = {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'};
  if (event.httpMethod !== 'GET') return {statusCode:405,headers:{...headers,Allow:'GET'},body:'{}'};
  try { return {statusCode:200,headers,body:JSON.stringify(await getSteamProfile())}; }
  catch { return {statusCode:503,headers,body:JSON.stringify({error:'steam_unavailable'})}; }
};
