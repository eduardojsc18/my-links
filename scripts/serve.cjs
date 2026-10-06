const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../src');
const types = { '.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.ico':'image/x-icon' };
const {getSteamProfile} = require('../server/steam-profile.cjs');
const server=http.createServer(async (req,res)=>{
  let pathname; try { pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname); } catch {res.writeHead(400);res.end();return;}
  if(pathname === '/api/steam-profile') {
    if(req.method !== 'GET') {res.writeHead(405,{Allow:'GET'});res.end();return;}
    try { const data=await getSteamProfile();res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data)); }
    catch {res.writeHead(503,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end('{"error":"steam_unavailable"}');}
    return;
  }
  const target=path.resolve(root,'.'+pathname+(pathname.endsWith('/')?'index.html':''));
  if(target!==root && !target.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  fs.readFile(target,(error,data)=>{if(error){res.writeHead(404);res.end('Not found');return;}res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);});
});
server.listen(Number(process.env.PORT)||4173,'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:'+server.address().port));
