const {chromium}=require('/opt/node22/lib/node_modules/playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve('index.html'));await p.waitForTimeout(400);
const A=JSON.parse(fs.readFileSync('cm/dobset.json','utf8')).filter(x=>x.tq!=='unknown'),B=JSON.parse(fs.readFileSync('cm/marset2.json','utf8'));
const data=[...A.map(x=>({...x,set:'A'})),...B.map(x=>({...x,set:'B'}))];
const out=await p.evaluate(data=>{
 const AGEW={marriage:[16,70],children:[16,60],career:[14,85],wealth:[16,90],education:[14,30],jobloss:[16,85],accident:[0,95],healthc:[0,95],finloss:[16,95],bereave:[0,95],divorce:[18,85],studybreak:[10,30]};
 const NEG=['jobloss','accident','healthc','finloss','bereave','divorce','studybreak'];
 const RELH={father:9,mother:4,spouse:7,child:5,sibling:3};
 const HX=e=>({marriage:7,children:5,career:10,wealth:11,education:4,jobloss:10,accident:8,healthc:6,finloss:12,studybreak:4,divorce:7}[e[0]]||(e[0]==='bereave'?RELH[e[3]]:null));
 const rel=(a,b)=>((a-b+12)%12)+1,IN=(a,b,s)=>s.includes(rel(a,b));
 const trS=jd=>{const s=siderealAll(jd,SET.ayan);return PL.slice(0,9).map(k=>signOf(s[k]));};
 const AGG={},DET=[];
 const add=(grp,k,hit,base)=>{const key=grp+'|'+k;const r=AGG[key]=AGG[key]||{H:0,E:0,V:0,n:0};r.n++;r.H+=hit?1:0;r.E+=base;r.V+=base*(1-base);};
 for(const X of data){const ch=buildChart({...X.inp,noEnrich:true});const N=ch.planets.slice(0,9).map(q=>q.sign),NL=ch.planets.slice(0,9).map(q=>q.lon);const lag=ch.lagna,fem=X.g==='f';
  const LL=lordOf(ch,1),L7=lordOf(ch,7),VS=signOf(NL[LL]+NL[L7]),spouseK=fem?2:5,selfK=fem?5:4,KAR={father:0,mother:1,spouse:spouseK,child:4,sibling:2};
  const hsg=h=>(lag+h-1)%12,aspects=(L,t)=>N[L]===t||signAspects(L).some(a=>(N[L]+a-1)%12===t);
  const RULES={
   'Dohra gochar (Guru+Shani) ghatna-bhaav/swami par':{f:(T,jd,e,X_)=>{const t=[hsg(X_),N[lordOf(ch,X_)]];return t.some(s=>IN(T[4],s,[1,5,7,9]))&&t.some(s=>IN(T[6],s,[1,4,7,11]));}},
   'Guru gochar ghatna-bhaav/swami par':{f:(T,jd,e,X_)=>[hsg(X_),N[lordOf(ch,X_)]].some(s=>IN(T[4],s,[1,5,7,9]))},
   'Shani gochar ghatna-bhaav/swami par':{f:(T,jd,e,X_)=>[hsg(X_),N[lordOf(ch,X_)]].some(s=>IN(T[6],s,[1,4,7,11]))},
   'Dasha (MD ya AD) ka ghatna-bhaav/swami se sambandh':{f:(T,jd,e,X_)=>{const d=dashaAt(ch,jd);if(!d)return null;const XL=lordOf(ch,X_),hs=hsg(X_);return [d.md.lord,d.ad.lord].some(L=>L===XL||aspects(L,hs)||aspects(L,N[XL])||N[L]===N[XL]);}},
   'Antardasha swami = ghatna-bhaav ka swami ya usme baitha':{f:(T,jd,e,X_)=>{const d=dashaAt(ch,jd);if(!d)return null;const L=d.ad.lord;return L===lordOf(ch,X_)||N[L]===hsg(X_);}},
   'Buri ghatna: antardasha swami 6/8/12 ka swami ya usme':{neg:1,f:(T,jd,e)=>{const d=dashaAt(ch,jd);if(!d)return null;const L=d.ad.lord;return [6,8,12].some(h=>lordOf(ch,h)===L||N[L]===hsg(h));}},
   'Achhi ghatna: antardasha swami kendra/trikona ka swami':{pos:1,f:(T,jd)=>{const d=dashaAt(ch,jd);if(!d)return null;const L=d.ad.lord;return L<7&&[1,4,5,7,9,10].some(h=>lordOf(ch,h)===L);}},
   'Antardasha swami mahadasha swami se 6/8/12 (buri) ya 1/5/9/10/11 (achhi)':{f:(T,jd,e)=>{const d=dashaAt(ch,jd);if(!d)return null;const h=rel(N[d.ad.lord],N[d.md.lord]);return NEG.includes(e[0])?[6,8,12].includes(h):[1,5,9,10,11].includes(h);}},
   'KN Rao P3 vivah: Guru Vivah Saham par':{only:'marriage',f:T=>IN(T[4],VS,[1,5,7,9])},
   'KN Rao P5 vivah: gochar lagnesh-saptamesh saath/aamne':{only:'marriage',f:T=>[1,7].includes(rel(T[LL],T[L7]))},
   'KN Rao P7 vivah: Surya lagna/saptam ke paas':{only:'marriage',f:T=>[12,1,2,6,7,8].includes(rel(T[0],lag))},
   'KN Rao P8 vivah: lagnesh 7H paas / saptamesh lagna paas':{only:'marriage',f:T=>[6,7,8].includes(rel(T[LL],lag))||[12,1,2].includes(rel(T[L7],lag))},
   'BNN (bina samay) vivah: Guru Shukra/Mangal se 1/5/7/9':{only:'marriage',f:T=>IN(T[4],N[spouseK],[1,5,7,9])},
   'BNN (bina samay) santaan: Guru janm-Guru se 1/5/7/9':{only:'children',f:T=>IN(T[4],N[4],[1,5,7,9])},
   'BNN (bina samay) career: Shani janm-Guru se 1/5/7/9':{only:'career',f:T=>IN(T[6],N[4],[1,5,7,9])},
   'BNN (bina samay) naukri jaana: Shani Shani se 1/7 ya Rahu-Ketu Shani par':{only:'jobloss',f:T=>IN(T[6],N[6],[1,7])||T[7]===N[6]||T[8]===N[6]},
   'BNN (bina samay) chot/rog: Shani/Rahu/Ketu jaatak-karak se 1/7':{only:['accident','healthc'],f:T=>[T[6],T[7],T[8]].some(s=>IN(s,N[selfK],[1,7]))},
   'Sade sati/dhaiya (bina samay) buri ghatna':{neg:1,f:T=>IN(T[6],N[1],[12,1,2,4,8])},
  };
  for(const e of X.ev){const X_=HX(e);const [y,m,d]=e[1].split('-').map(Number);const jd=julian(y,m,d,12-X.inp.tz);const det={n:X.n,k:e[0],d:e[1],ap:e[2]?1:0,r:[]};
   for(const [name,R0] of Object.entries(RULES)){if(R0.only&&![].concat(R0.only).includes(e[0]))continue;if(R0.neg&&!NEG.includes(e[0]))continue;if(R0.pos&&NEG.includes(e[0]))continue;
    if(!R0.only&&!X_)continue;
    const hit=R0.f(trS(jd),jd,e,X_);if(hit===null)continue;
    const w=AGEW[e[0]];let c=0,t=0;for(let a=w[0]*12;a<w[1]*12;a++){const j=ch.jd+(a+0.5)*30.4375;if(X.death){const [dy,dm,dd]=X.death.split('-').map(Number);if(j>julian(dy,dm,dd,0))break;}if(j>julianNow())break;const v=R0.f(trS(j),j,e,X_);if(v===null)continue;t++;if(v)c++;}
    if(!t)continue;const base=c/t;
    const grp=X.set==='B'?'B':(X.tq==='exact'?'A-exact':'A-approx');add(grp,name,hit,base);add('ALL',name,hit,base);
    if(X.n.startsWith('Rohit'))det.r.push({name,hit,base});}
   if(X.n.startsWith('Rohit'))DET.push(det);}
 }
 return {AGG,DET};},data);
fs.writeFileSync('cm/rules2_out.json',JSON.stringify(out));
const rows=Object.entries(out.AGG).map(([k,r])=>{const [g,nm]=k.split('|');return {g,nm,...r,z:(r.H-r.E)/Math.sqrt(r.V||1)};});
for(const g of ['A-exact','A-approx','B','ALL']){console.log('\n=== '+g);rows.filter(r=>r.g===g).forEach(r=>console.log(`${r.nm.padEnd(76)} ${String(r.H).padStart(3)}/${String(r.n).padEnd(3)} chance ${r.E.toFixed(1).padStart(5)} (${(100*r.E/r.n).toFixed(0).padStart(2)}%) z ${r.z>=0?'+':''}${r.z.toFixed(2)}`));}
console.log('\n=== ROHIT');out.DET.forEach(d=>{console.log(`${d.d}${d.ap?'≈':''} ${d.k}`);d.r.forEach(r=>console.log(`   ${r.hit?'✓':'✗'} ${r.name}  (aapki zindagi mein ${Math.round(r.base*100)}% mahine)`));});
console.log('ERR',errs.slice(0,3));await b.close();})();
