const {chromium}=require('/opt/node22/lib/node_modules/playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('file://'+path.resolve('index.html'));await p.waitForTimeout(400);
const X=JSON.parse(fs.readFileSync('cm/dobset.json','utf8'))[0];
const r=await p.evaluate(X=>{S.lang='en';const out=[];for(const dm of [-60,-30,-15,-5,0,5,15,30,60]){const t=X.inp.h*60+X.inp.mi+dm;const inp={...X.inp,h:Math.floor(t/60),mi:t%60};
 setForm({name:X.n,gender:X.g,city:'x',...inp});make();const ch=S.ch;putPev(ch,X.ev.map(([k,d,ap])=>ap?{k,d,ap:1}:{k,d}));bkClear(ch);const cal=kpbCal(ch);const kp=cal.rows.map(r=>r.kp);
 out.push({dm,time:`${String(inp.h).padStart(2,'0')}:${String(inp.mi).padStart(2,'0')}`,lagna:SN.en[ch.lagna],kp:Math.round(100*kp.reduce((a,b)=>a+b,0)/kp.length),top:kp.filter(v=>v>=0.75).length,n:kp.length});}return out;},X);
r.forEach(x=>console.log(`${x.dm>=0?'+':''}${x.dm} min (${x.time}) lagna ${x.lagna}: KP ausat ${x.kp}, top-25% ${x.top}/${x.n}`));await b.close();})();
