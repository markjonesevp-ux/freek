// Which extra angle (if any) makes the running-year engine pick out the year of a real event better than chance?
// Each variant is scored on all 240 events and separately on two halves of the people (alternating), so a gain has to hold in both.
const {chromium}=require('/opt/node22/lib/node_modules/playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve('index.html'));await p.waitForTimeout(400);
const A=JSON.parse(fs.readFileSync('cm/dobset.json','utf8')),B=JSON.parse(fs.readFileSync('cm/marset2.json','utf8'));
const data=[...A.filter(x=>x.tq!=='unknown'),...B];
const V={allcol:{nat:1,kar:1,d9:1,nak:1,moon:1,vl:1,ad:1,col:1},allcolnodes:{nat:1,kar:1,d9:1,nak:1,moon:1,vl:1,ad:1,col:1,nodes:1}};
const out=await p.evaluate(({data,V})=>{S.lang='en';const R={};
 for(const [vn,opt] of Object.entries(V)){const acc={all:[0,0,0,0],h0:[0,0,0,0],h1:[0,0,0,0],ar:[0,0,0,0]};
  data.forEach((X,pi)=>{const ch=buildChart({...X.inp,gender:X.g,noEnrich:true});
   for(const e of X.ev){const m=SYA_EVA[e[0]];if(!m)continue;const [y,mo,d]=e[1].split('-').map(Number),jd=julian(y,mo,d,12-X.inp.tz);if(jd<ch.jd)continue;
    const ry=runningYearAt(ch,jd),sg=m[1];
    const hit=(r2,tone)=>{const r=syaYear(ch,r2,opt),a=r.areas.find(x=>x.k===m[0]);return a.rank<=4&&(!tone||sg===0||(sg<0?a.tone<0.25:a.tone>-0.25));};
    for(const tone of [1,0]){let c=0;for(let k=1;k<12;k++)if(hit(ry+k,tone))c++;const h=hit(ry,tone)?1:0,e0=c/11;
     const tgt=tone?[acc.all,acc['h'+(pi%2)]]:[acc.ar];tgt.forEach(t=>{t[0]++;t[1]+=h;t[2]+=e0;t[3]+=e0*(1-e0);});}}});
  R[vn]=acc;}return R;},{data,V});
const f=t=>`${t[1]}/${t[0]} vs ${t[2].toFixed(1)} z ${((t[1]-t[2])/Math.sqrt(t[3]||1)).toFixed(2).padStart(5)}`;
console.log('variant'.padEnd(13),'ALL (top4+tone)'.padEnd(26),'half A'.padEnd(26),'half B'.padEnd(26),'top4 only');
for(const [k,a] of Object.entries(out))console.log(k.padEnd(13),f(a.all).padEnd(26),f(a.h0).padEnd(26),f(a.h1).padEnd(26),f(a.ar));
console.log('ERR',errs.slice(0,3));await b.close();})();
