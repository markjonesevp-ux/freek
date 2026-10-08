const {chromium}=require('/opt/node22/lib/node_modules/playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('file://'+path.resolve('index.html'));await p.waitForTimeout(400);
const X=JSON.parse(fs.readFileSync('cm/dobset.json','utf8'))[0];
const r=await p.evaluate(X=>{S.lang='en';setForm({name:X.n,gender:X.g,city:'x',...X.inp});make();const ch=S.ch;putPev(ch,X.ev.map(([k,d,ap])=>ap?{k,d,ap:1}:{k,d}));bkClear(ch);
 const cal=kpbCal(ch);const rk=rkBacktest(ch);
 return {rows:cal.rows.map(r=>({d:r.E.e.d,k:r.E.e.k,m:r.E.m.id,dir:r.E.dir,kp:Math.round(r.kp*100),loo:Math.round(r.loo*100),par:Math.round(r.par*100)})),m:Object.fromEntries(Object.entries(rk.res).filter(([k,v])=>v.n).map(([k,v])=>[k,[v.h,v.n,+v.e.toFixed(1)]]))};},X);
r.rows.forEach(x=>console.log(x.d,x.k,'→ KP vishay',x.m,x.dir<0?'(ulta)':'','KP',x.kp,'LOO',x.loo,'Parashari',x.par));console.log(JSON.stringify(r.m));await b.close();})();
