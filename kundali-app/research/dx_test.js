// Tests of rules from "Kundali Analysis" (Astro Pooja) docx + "Empty House Theory & Karaka" (M. Joshi) pdf
// Same method as rules2.js: per event, hit vs. the person's own base rate over the age window (months).
const {chromium}=require('/opt/node22/lib/node_modules/playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve('index.html'));await p.waitForTimeout(400);
const ALL=JSON.parse(fs.readFileSync('cm/dobset.json','utf8')),B=JSON.parse(fs.readFileSync('cm/marset2.json','utf8'));
const data=[...ALL.filter(x=>x.tq!=='unknown').map(x=>({...x,set:'A'})),...B.map(x=>({...x,set:'B'}))];
const out=await p.evaluate(({data,ALL})=>{
 const AGEW={marriage:[16,70],children:[16,60],career:[14,85],wealth:[16,90],education:[14,30],jobloss:[16,85],accident:[0,95],healthc:[0,95],finloss:[16,95],bereave:[0,95],divorce:[18,85],studybreak:[10,30]};
 const NEG=['jobloss','accident','healthc','finloss','bereave','divorce','studybreak'];
 const RELH={father:9,mother:4,spouse:7,child:5,sibling:3};
 const HX=e=>({marriage:7,children:5,career:10,wealth:11,education:4,jobloss:10,accident:8,healthc:6,finloss:12,studybreak:4,divorce:7}[e[0]]||(e[0]==='bereave'?RELH[e[3]]:null));
 const rel=(a,b)=>((a-b+12)%12)+1;
 const trS=jd=>{const s=siderealAll(jd,SET.ayan);return PL.slice(0,9).map(k=>signOf(s[k]));};
 const MAL=[0,2,6,7,8],EXL=[10,33,298,165,95,357,200];
 const AGG={},DET=[],STAT=[];
 const add=(grp,k,hit,base)=>{const key=grp+'|'+k;const r=AGG[key]=AGG[key]||{H:0,E:0,V:0,n:0};r.n++;r.H+=hit?1:0;r.E+=base;r.V+=base*(1-base);};
 const setup=X=>{const ch=buildChart({...X.inp,noEnrich:true});const N=ch.planets.slice(0,9).map(q=>q.sign),NL=ch.planets.slice(0,9).map(q=>q.lon),lag=ch.lagna,fem=X.g==='f';
  const hsg=h=>(lag+h-1)%12,hof=s=>rel(s,lag);
  const touches=(L,t,nodes=true)=>N[L]===t||((L<7||nodes)&&signAspects(L).some(a=>(N[L]+a-1)%12===t));
  const trT=(T,L,t)=>T[L]===t||signAspects(L).some(a=>(T[L]+a-1)%12===t);
  const KAR={1:[0],2:[4],3:[2],4:[1],5:[4],6:[2,6],7:[fem?4:5],8:[6],9:[4],10:[0,3,6],11:[4],12:[6]};
  const pure=(h,nodes)=>{const s=hsg(h);return ![0,1,2,3,4,5,6,7,8].some(L=>touches(L,s,nodes));};
  const avrohi=L=>L<7&&((NL[L]-EXL[L]+360)%360)<180;
  const mdIdx=jd=>ch.dasha.mds.findIndex(m=>jd>=m.start&&jd<m.end);
  const bounds=ch.dasha.mds.slice(1).map(m=>m.start);
  return {ch,N,NL,lag,fem,hsg,hof,touches,trT,KAR,pure,avrohi,mdIdx,bounds};};
 for(const X of data){const C=setup(X),{ch,N,NL,lag,fem,hsg,hof,touches,trT,KAR,pure,avrohi,mdIdx,bounds}=C;
  const L5=lordOf(ch,5),L9=lordOf(ch,9),L7=lordOf(ch,7);
  const tgt59=[hsg(5),hsg(9),N[L5],N[L9]],tgt7=[hsg(7),N[L7]];
  const cand7=new Set([L7,7,fem?4:5]);for(let L=0;L<9;L++)if(touches(L,hsg(7))||touches(L,N[L7])||N[L]===N[L7])cand7.add(L);
  const shad=L=>MAL.includes(L)&&MAL.some(M=>M!==L&&[6,8].includes(rel(N[M],N[L])));
  const RULES={
   'Dasha chidra: ghatna MD badalne ke ±6 mahine mein':{neg:1,f:jd=>bounds.some(t=>Math.abs(jd-t)<=182.6)},
   '(control) achhi ghatna MD badalne ke ±6 mahine mein':{pos:1,f:jd=>bounds.some(t=>Math.abs(jd-t)<=182.6)},
   'Pratikool MD sthan: 4tha Shani / 5va Rahu-Mangal / 6tha Guru':{neg:1,f:jd=>{const i=mdIdx(jd);if(i<0)return null;const L=ch.dasha.mds[i].lord,pz=i+1;return (pz===4&&L===6)||(pz===5&&(L===7||L===2))||(pz===6&&L===4);}},
   'Avrohi MD swami (uchch se neech ki or)':{neg:1,f:jd=>{const d=dashaAt(ch,jd);if(!d)return null;return avrohi(d.md.lord);}},
   '(control) achhi ghatna avrohi MD mein':{pos:1,f:jd=>{const d=dashaAt(ch,jd);if(!d)return null;return avrohi(d.md.lord);}},
   'Avrohi AD swami':{neg:1,f:jd=>{const d=dashaAt(ch,jd);if(!d)return null;return avrohi(d.ad.lord);}},
   'MD-AD swami 1/7 (Ma-Mo, Sa-Ju, Ma-Ju chhodkar)':{neg:1,f:jd=>{const d=dashaAt(ch,jd);if(!d)return null;const a=d.md.lord,c=d.ad.lord,pr=[a,c].sort().join();if(['1,2','4,6','2,4'].includes(pr))return false;return rel(N[c],N[a])===7;}},
   'AD swami naisargik paap (Su/Ma/Sa/Ra/Ke)':{neg:1,f:jd=>{const d=dashaAt(ch,jd);if(!d)return null;return MAL.includes(d.ad.lord);}},
   'Durghatna: MD/AD swami paap jo doosre paap se 6/8 (shadashtak)':{only:['accident','healthc'],f:jd=>{const d=dashaAt(ch,jd);if(!d)return null;return shad(d.md.lord)||shad(d.ad.lord);}},
   'Santaan gochar: Shani 5/9 bhaav ya 5L/9L par (drishti/gochar)':{only:'children',f:(jd,T)=>tgt59.some(s=>trT(T,6,s))},
   'Santaan gochar: Guru 5/9 bhaav ya 5L/9L par':{only:'children',f:(jd,T)=>tgt59.some(s=>trT(T,4,s))},
   'Santaan gochar: Shani AUR Guru dono':{only:'children',f:(jd,T)=>tgt59.some(s=>trT(T,6,s))&&tgt59.some(s=>trT(T,4,s))},
   'Santaan gochar: Mangal 5/9/5L/9L par (sirf mahila)':{only:'children',fem:1,f:(jd,T)=>tgt59.some(s=>trT(T,2,s))},
   'Vivah dasha: MD ya AD swami 7th/7L/Rahu/karak se juda':{only:'marriage',f:jd=>{const d=dashaAt(ch,jd);if(!d)return null;return cand7.has(d.md.lord)||cand7.has(d.ad.lord);}},
   'Vivah dasha: AD swami 7th/7L/Rahu/karak se juda':{only:'marriage',f:jd=>{const d=dashaAt(ch,jd);if(!d)return null;return cand7.has(d.ad.lord);}},
   'Vivah gochar: Mangal 7th ya 7L par':{only:'marriage',f:(jd,T)=>tgt7.some(s=>trT(T,2,s))},
   'Khali (shuddh) bhaav: ghatna us bhaav ke swami/karak ki MD/AD mein':{pureOnly:1,f:(jd,T,e,h)=>{const d=dashaAt(ch,jd);if(!d)return null;const s=new Set([lordOf(ch,h),...KAR[h]]);return s.has(d.md.lord)||s.has(d.ad.lord);}},
   '(tulna) bhara bhaav: ghatna us bhaav ke swami/karak ki MD/AD mein':{impureOnly:1,f:(jd,T,e,h)=>{const d=dashaAt(ch,jd);if(!d)return null;const s=new Set([lordOf(ch,h),...KAR[h]]);return s.has(d.md.lord)||s.has(d.ad.lord);}},
  };
  const det={n:X.n,r:[]};
  for(const e of X.ev){const h=HX(e);const [y,m,d]=e[1].split('-').map(Number);const jd=julian(y,m,d,12-X.inp.tz);
   for(const [name,R0] of Object.entries(RULES)){if(R0.only&&![].concat(R0.only).includes(e[0]))continue;if(R0.neg&&!NEG.includes(e[0]))continue;if(R0.pos&&NEG.includes(e[0]))continue;
    if(R0.fem&&!fem)continue;if((R0.pureOnly||R0.impureOnly)&&!h)continue;if(R0.pureOnly&&!pure(h,false))continue;if(R0.impureOnly&&pure(h,false))continue;
    const hit=R0.f(jd,trS(jd),e,h);if(hit===null)continue;
    const w=AGEW[e[0]];let c=0,t=0;for(let a=w[0]*12;a<w[1]*12;a++){const j=ch.jd+(a+0.5)*30.4375;if(X.death){const [dy,dm,dd]=X.death.split('-').map(Number);if(j>julian(dy,dm,dd,0))break;}if(j>julianNow())break;const v=R0.f(j,trS(j),e,h);if(v===null)continue;t++;if(v)c++;}
    if(!t)continue;const base=c/t;add(X.set==='B'?'B':'A',name,hit,base);add('ALL',name,hit,base);
    if(X.n.startsWith('Rohit'))det.r.push({ev:e[0]+' '+e[1],name,hit,base});}}
  if(X.n.startsWith('Rohit'))DET.push(det);
  // static (person-level) facts
  const fm=X.ev.filter(e=>e[0]==='marriage').map(e=>e[1]).sort()[0],fc=X.ev.filter(e=>e[0]==='children').map(e=>e[1]).sort()[0];
  const age=s=>s?(julian(...s.split('-').map(Number),12)-ch.jd)/365.25:null;
  const vk=fem?4:5,h7=rel(N[vk],hsg(7)),h5=rel(N[4],hsg(5));
  const satAsp=[N[5],N[1],lag,N[lordOf(ch,1)]].filter(s=>touches(6,s)).length;
  const satDelay=(satAsp>=2?1:0)+(rel(N[6],lag)===8&&rel(N[6],N[5])===8?1:0)+([1,7].includes(rel(N[6],N[4]))?1:0)+(touches(6,N[1])?1:0)+(N[6]===11?1:0);
  const pureN=[...Array(12).keys()].filter(i=>pure(i+1,false)).length,pureN2=[...Array(12).keys()].filter(i=>pure(i+1,true)).length;
  STAT.push({n:X.n,set:X.set,g:X.g,fm:age(fm),fc:age(fc),div:X.ev.some(e=>e[0]==='divorce')?1:0,nmar:X.ev.filter(e=>e[0]==='marriage').length,
   k7:[1,6,8,12].includes(h7)?(h7===1?'own':'dus'):'ok',k5:[1,6,8,12].includes(h5)?(h5===1?'own':'dus'):'ok',satAsp,satDelay,pureN,pureN2});
 }
 // Beeja/Kshetra sphuta on parents (all DOB incl. unknown time for men: Sun+Jup+Ven barely move in a day)
 const SPH=[];for(const X of ALL){if(!X.ev.some(e=>e[0]==='children'))continue;const fem=X.g==='f';if(fem&&X.tq==='unknown')continue;
  const ch=buildChart({...X.inp,noEnrich:true}),P=ch.planets;const s=norm(fem?P[4].lon+P[1].lon+P[2].lon:P[4].lon+P[5].lon+P[0].lon);
  const r=signOf(s),n9=varga(s,9),odd=x=>x%2===0;const good=fem?(!odd(r)&&!odd(n9)):(odd(r)&&odd(n9)),bad=fem?(odd(r)&&odd(n9)):(!odd(r)&&!odd(n9));
  SPH.push({n:X.n,g:X.g,v:good?'assured':bad?'delayed/denied':'delay-but-yes',kids:X.ev.filter(e=>e[0]==='children').length,banjar:[0,2,4,5,10].includes(r)});}
 return {AGG,DET,STAT,SPH};},{data,ALL});
fs.writeFileSync('cm/dx_out.json',JSON.stringify(out));
const rows=Object.entries(out.AGG).map(([k,r])=>{const [g,nm]=k.split('|');return {g,nm,...r,z:(r.H-r.E)/Math.sqrt(r.V||1)};});
for(const g of ['ALL']){console.log('\n=== '+g);rows.filter(r=>r.g===g).forEach(r=>console.log(`${r.nm.padEnd(70)} ${String(r.H).padStart(3)}/${String(r.n).padEnd(3)} chance ${r.E.toFixed(1).padStart(5)} (${(100*r.E/r.n).toFixed(0).padStart(2)}%) z ${r.z>=0?'+':''}${r.z.toFixed(2)}`));}
console.log('\n=== ROHIT');out.DET.forEach(d=>d.r.forEach(r=>console.log(`${r.ev.padEnd(22)} ${r.hit?'✓':'✗'} ${r.name}  (aapki zindagi ke ${Math.round(r.base*100)}% mahine)`)));
const S=out.STAT,avg=a=>a.length?(a.reduce((x,y)=>x+y,0)/a.length).toFixed(1):'-';
console.log('\n=== STATIC (timed charts)');
for(const k of ['k7','k5'])for(const v of ['own','dus','ok']){const g=S.filter(s=>s[k]===v);console.log(k,v,'n',g.length,'avg first-marriage age',avg(g.map(s=>s.fm).filter(x=>x!=null)),'avg first-child age',avg(g.map(s=>s.fc).filter(x=>x!=null)),'divorce',g.filter(s=>s.div).length,'multi-marr',g.filter(s=>s.nmar>1).length);}
for(let v=0;v<=4;v++){const g=S.filter(s=>s.satDelay===v);if(g.length)console.log('satDelay',v,'n',g.length,'avg first-marriage age',avg(g.map(s=>s.fm).filter(x=>x!=null)));}
console.log('pure houses per chart (no nodes asp):',S.map(s=>s.pureN).join(' '),' | with node asp:',S.map(s=>s.pureN2).join(' '));
console.log('\n=== SPHUTA among parents');const c={};out.SPH.forEach(s=>{const k=s.g+' '+s.v;c[k]=(c[k]||0)+1;});console.log(c,'banjar-sign parents',out.SPH.filter(s=>s.banjar).length+'/'+out.SPH.length);
console.log(out.SPH.filter(s=>s.n.startsWith('Rohit')));
console.log('ERR',errs.slice(0,3));await b.close();})();
