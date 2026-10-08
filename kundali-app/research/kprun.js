const {chromium}=require('/opt/node22/lib/node_modules/playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+path.resolve('index.html'));await p.waitForTimeout(400);
const A=JSON.parse(fs.readFileSync('cm/dobset.json','utf8')).filter(x=>x.tq!=='unknown').map(x=>({...x,set:x.tq==='exact'?'A-exact':'A-approx'})),B=JSON.parse(fs.readFileSync('cm/marset2.json','utf8')).map(x=>({...x,set:'B'}));
const r=await p.evaluate(data=>{S.lang='en';const out=[];
 for(const X of data){setForm({name:X.n,gender:X.g,city:'x',...X.inp});make();const ch=S.ch;
  putPev(ch,X.ev.map(([k,d,ap])=>ap?{k,d,ap:1}:{k,d}));bkClear(ch);const res={n:X.n,set:X.set};
  try{const cal=kpbCal(ch);res.kp=cal.rows.map(r=>r.kp);res.loo=cal.rows.map(r=>r.loo);res.par=cal.rows.map(r=>r.par);}catch(e){res.err=String(e);}
  try{const rk=rkBacktest(ch);res.m={};for(const [k,v] of Object.entries(rk.res))if(v.n)res.m[k]=[v.h,v.n,v.e];}catch(e){res.err2=String(e);}
  out.push(res);}return out;},[...A,...B]);
fs.writeFileSync('cm/kprun_out.json',JSON.stringify(r));
const f=x=>Math.round(x*100),mean=a=>a.length?f(a.reduce((s,v)=>s+v,0)/a.length):'-';
for(const g of ['A-exact','A-approx','B']){const G=r.filter(x=>x.set===g);const kp=G.flatMap(x=>x.kp||[]),loo=G.flatMap(x=>x.loo||[]),par=G.flatMap(x=>x.par||[]);
 console.log(`\n=== ${g}: ${G.length} log | KP (app engine) ausat ${mean(kp)} top25 ${kp.filter(v=>v>=0.75).length}/${kp.length} (sanyog ${(kp.length/4).toFixed(1)}) | KP LOO ausat ${mean(loo)} | Parashari ausat ${mean(par)}`);
 console.log('   '+G.map(x=>`${x.n.split(' ')[0]} ${mean(x.kp||[])}`).join(' · '));
 const agg={};G.forEach(x=>{for(const [k,v] of Object.entries(x.m||{})){agg[k]=agg[k]||[0,0,0];for(let i=0;i<3;i++)agg[k][i]+=v[i];}});
 console.log('   Paddhatiyan: '+Object.entries(agg).sort((a,b)=>(b[1][0]-b[1][2])-(a[1][0]-a[1][2])).map(([k,v])=>`${k} ${v[0]}/${v[1]} (sanyog ${v[2].toFixed(1)})`).join(' | '));}
const all=r.filter(x=>!x.n.startsWith('Rohit'));const kp=all.flatMap(x=>x.kp||[]);console.log(`\nRohit ke alawa sab samay-wale: KP ausat ${mean(kp)} top25 ${kp.filter(v=>v>=0.75).length}/${kp.length} (sanyog ${(kp.length/4).toFixed(1)})`);
const rh=r.find(x=>x.n.startsWith('Rohit'));console.log('Rohit KP',(rh.kp||[]).map(f).join(','),'LOO',(rh.loo||[]).map(f).join(','));
console.log('ERR',errs.slice(0,3),r.filter(x=>x.err||x.err2).map(x=>x.n+':'+(x.err||x.err2)).slice(0,3));await b.close();})();
