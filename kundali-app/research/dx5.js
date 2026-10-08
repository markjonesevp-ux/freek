// Age-matched null for the two dasha-tara rules that looked positive: for an event at age a, chance = share of OTHER timed people for whom the rule holds at the same age.
const {chromium}=require('/opt/node22/lib/node_modules/playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('file://'+path.resolve('index.html'));await p.waitForTimeout(400);
const A=JSON.parse(fs.readFileSync('cm/dobset.json','utf8')),B=JSON.parse(fs.readFileSync('cm/marset2.json','utf8'));
const data=[...A.filter(x=>x.tq!=='unknown'),...B];
const out=await p.evaluate(({data})=>{const NEG=['jobloss','accident','healthc','finloss','bereave','divorce','studybreak'];
 const tara=(n,j)=>((n-j+27)%27)%9+1;
 const P=data.map(X=>{const ch=buildChart({...X.inp,noEnrich:true});return {X,ch,jn:ch.planets[1].nak,NN:ch.planets.slice(0,9).map(q=>q.nak)};});
 const R={
  md357:{neg:1,f:(Q,jd)=>{const i=Q.ch.dasha.mds.findIndex(m=>jd>=m.start&&jd<m.end);return i<0?null:[2,4,6].includes(i%9);}},
  adGood:{pos:1,f:(Q,jd)=>{const d=dashaAt(Q.ch,jd);return d?[2,4,6,8,9].includes(tara(Q.NN[d.ad.lord],Q.jn)):null;}},
  adBad:{neg:1,f:(Q,jd)=>{const d=dashaAt(Q.ch,jd);return d?[3,5,7].includes(tara(Q.NN[d.ad.lord],Q.jn)):null;}},
  adGoodNeg:{neg:1,f:(Q,jd)=>{const d=dashaAt(Q.ch,jd);return d?[2,4,6,8,9].includes(tara(Q.NN[d.ad.lord],Q.jn)):null;}},
  adBadPos:{pos:1,f:(Q,jd)=>{const d=dashaAt(Q.ch,jd);return d?[3,5,7].includes(tara(Q.NN[d.ad.lord],Q.jn)):null;}},
  md357pos:{pos:1,f:(Q,jd)=>{const i=Q.ch.dasha.mds.findIndex(m=>jd>=m.start&&jd<m.end);return i<0?null:[2,4,6].includes(i%9);}},
 };const AGG={};
 for(const Q of P)for(const e of Q.X.ev){const [y,m,d]=e[1].split('-').map(Number);const jd=julian(y,m,d,12-Q.X.inp.tz),age=jd-Q.ch.jd;
  for(const [k,r] of Object.entries(R)){if(r.neg&&!NEG.includes(e[0]))continue;if(r.pos&&NEG.includes(e[0]))continue;const hit=r.f(Q,jd);if(hit===null)continue;
   let c=0,t=0;for(const O of P){if(O===Q)continue;const v=r.f(O,O.ch.jd+age);if(v===null)continue;t++;if(v)c++;}if(!t)continue;const base=c/t;
   const a=AGG[k]=AGG[k]||{H:0,E:0,V:0,n:0};a.n++;a.H+=hit?1:0;a.E+=base;a.V+=base*(1-base);}}
 return AGG;},{data});
for(const [k,r] of Object.entries(out))console.log(k.padEnd(10),r.H+'/'+r.n,'age-matched chance',r.E.toFixed(1),`(${(100*r.E/r.n).toFixed(0)}%)`,'z',((r.H-r.E)/Math.sqrt(r.V)).toFixed(2));
await b.close();})();
