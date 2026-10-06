const test = require('node:test');
const assert = require('node:assert/strict');
test('Explicit mode accepts public business name and rejects unknown modes', async()=>{
  const {profileFromUrl}=await import('../src/assets/js/profile-url.js');
  assert.equal(profileFromUrl('https://example.com/?perfil=business'),'professional');
  assert.equal(profileFromUrl('https://example.com/?perfil=GAMER#inicio'),'gamer');
  assert.equal(profileFromUrl('https://example.com/?perfil=casual'),'casual');
  assert.equal(profileFromUrl('https://example.com/?perfil=unknown'),null);
  assert.equal(profileFromUrl('https://example.com/?perfil=constructor'),null);
  assert.equal(profileFromUrl('invalid'),null);
});
test('Share link encodes selected mode, keeps deployment path and tracking, removes fragment', async()=>{
  const {shareProfileUrl}=await import('../src/assets/js/profile-url.js');
  assert.equal(shareProfileUrl('https://example.com/my-links/src/?utm_source=linkedin&perfil=gamer#contato','professional'),'https://example.com/my-links/src/?utm_source=linkedin&perfil=business');
});
test('Before first paint, explicit mode wins over storage and blocked storage still opens Casual',()=>{
  const fs=require('node:fs');
  const vm=require('node:vm');
  const html=fs.readFileSync(require('node:path').join(__dirname,'../src/index.html'),'utf8');
  const bootstrap=html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];
  for(const [query,saved,expected,blocked] of [
    ['business','gamer','professional',false],['casual','professional','casual',false],
    ['gamer',null,'gamer',true],['unknown','gamer','gamer',false],
    ['constructor',null,'casual',true],['',null,'casual',true],
  ]) {
    const root={dataset:{},classList:{add(){}}};
    const icon={};
    const metadata={};
    vm.runInNewContext(bootstrap,{
      URL,location:{href:`https://example.com/?perfil=${query}`},
      document:{documentElement:root,getElementById:()=>icon,querySelector:()=>metadata},
      localStorage:{getItem(){if(blocked) throw Error('blocked'); return saved;}},
      matchMedia:()=>({matches:false}),setTimeout:()=>1,window:{},
    });
    assert.equal(root.dataset.profile,expected);
    assert.match(icon.href,new RegExp(`favicon-${expected==='professional'?'business':expected}\\.svg$`));
  }
});
