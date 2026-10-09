// Running-year engine + KP: does "both agree" pick out the year of a real event better than the 11 years around it?
const {chromium}=require('/opt/node22/lib/node_modules/playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve('index.html'));await p.waitForTimeout(400);
const A=JSON.parse(fs.readFileSync('cm/dobset.json','utf8')),B=JSON.parse(fs.readFileSync('cm/marset2.json','utf8'));
const data=[...A.filter(x=>x.tq!=='unknown'),...B];
const out=await p.evaluate(({data})=>{S.lang='en';const R={both:[0,0,0,0],kp:[0,0,0,0],eng:[0,0,0,0],bothH0:[0,0,0,0],bothH1:[0,0,0,0],kpH0:[0,0,0,0],kpH1:[0,0,0,0]},rohit=[];const add=(t,h,e)=>{t[0]++;t[1]+=h;t[2]+=e;t[3]+=e*(1-e);};
 data.forEach((X,pi)=>{if(X.n.startsWith('Rohit'))return;const ch=buildChart({...X.inp,gender:X.g,noEnrich:true});
  for(const e of X.ev){const t=e[0];if(!SYK_EV.includes(t)||!SYA_EVA[t])continue;const [y,mo,d]=e[1].split('-').map(Number),jd=julian(y,mo,d,12-X.inp.tz);if(jd<ch.jd||jd>julianNow())continue;
   const ry=runningYearAt(ch,jd);const f=r2=>{if(r2<1)return null;const K=sykYear(ch,r2)[t];if(!K)return null;const eng=sykEngine(syaYear(ch,r2),t);return {both:eng&&K.pct>=0.75,kp:K.pct>=0.75,eng};};
   const me=f(ry);if(!me)continue;const oth=[];for(let k=-5;k<=6;k++){if(!k)continue;const v=f(ry+k);if(v)oth.push(v);}if(!oth.length)continue;
   ['both','kp','eng'].forEach(m=>{const e0=oth.filter(v=>v[m]).length/oth.length;add(R[m],me[m]?1:0,e0);if(m==='kp')add(R['kpH'+(pi%2)],me[m]?1:0,e0);if(m==='both')add(R['bothH'+(pi%2)],me[m]?1:0,e0);});
   if(X.n.startsWith('Rohit'))rohit.push(t+' '+e[1]+' ry'+ry+' both:'+me.both+' kp:'+me.kp+' eng:'+me.eng);}});
 return {R,rohit};},{data});
const f=t=>`${t[1]}/${t[0]} vs ${t[2].toFixed(1)} z ${((t[1]-t[2])/Math.sqrt(t[3]||1)).toFixed(2)}`;
for(const [k,t] of Object.entries(out.R))console.log(k.padEnd(7),f(t));console.log(out.rohit.join('\n'));console.log('ERR',errs.slice(0,3));await b.close();})();
