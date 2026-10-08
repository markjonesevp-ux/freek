// Running-year engine (z_v284) on the timed charts: is the event's life area among that running year's top 4 (with a fitting tone)?
// Chance = the same check using the engine's output for the person's other 11 running years.
const {chromium}=require('/opt/node22/lib/node_modules/playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve('index.html'));await p.waitForTimeout(400);
const A=JSON.parse(fs.readFileSync('cm/dobset.json','utf8')),B=JSON.parse(fs.readFileSync('cm/marset2.json','utf8'));
const data=[...A.filter(x=>x.tq!=='unknown'),...B];
const out=await p.evaluate(({data})=>{S.lang='en';const REL={father:'father',mother:'home',spouse:'spouse',child:'children',sibling:'siblings'};
 const res={app:{H:0,E:0,V:0,n:0},rel:{H:0,E:0,V:0,n:0},area:{H:0,E:0,V:0,n:0},rank1:{H:0,E:0,V:0,n:0}},byType={},rohit=[];
 const add=(o,h,e)=>{o.n++;o.H+=h?1:0;o.E+=e;o.V+=e*(1-e);};
 for(const X of data){const ch=buildChart({...X.inp,gender:X.g,noEnrich:true});
  for(const e of X.ev){const m=SYA_EVA[e[0]];if(!m)continue;const [y,mo,d]=e[1].split('-').map(Number),jd=julian(y,mo,d,12-X.inp.tz);if(jd<ch.jd)continue;
   const ry=runningYearAt(ch,jd),sg=m[1];
   for(const mode of ['app','rel','area','rank1']){const ak=mode==='rel'&&e[0]==='bereave'?(REL[e[3]]||'sudden'):m[0];
    const hit=r2=>{const r=syaYear(ch,r2),a=r.areas.find(x=>x.k===ak);if(mode==='rank1')return a.rank===1;if(mode==='area')return a.rank<=4;return a.rank<=4&&(sg===0||(sg<0?a.tone<0.25:a.tone>-0.25));};
    let c=0;for(let k=1;k<12;k++)if(hit(ry+k))c++;const h=hit(ry);add(res[mode],h,c/11);
    if(mode==='app'){const t=byType[e[0]]=byType[e[0]]||{H:0,E:0,V:0,n:0};add(t,h,c/11);if(X.n.startsWith('Rohit'))rohit.push([e[0],e[1],ry,h,c/11]);}}}}
 return {res,byType,rohit};},{data});
const z=r=>((r.H-r.E)/Math.sqrt(r.V||1)).toFixed(2);
for(const [k,r] of Object.entries(out.res))console.log(k.padEnd(6),`${r.H}/${r.n}`,'chance',r.E.toFixed(1),`(${(100*r.E/r.n).toFixed(0)}%)`,'z',z(r));
console.log('--- by event type (app mode)');for(const [k,r] of Object.entries(out.byType))console.log(k.padEnd(11),`${r.H}/${r.n}`,'chance',r.E.toFixed(1),'z',z(r));
console.log('--- Rohit',out.rohit.map(x=>x.join(' ')).join(' | '));console.log('ERR',errs);await b.close();})();
