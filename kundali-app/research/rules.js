const {chromium}=require('/opt/node22/lib/node_modules/playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve('index.html'));await p.waitForTimeout(400);
const data=JSON.parse(fs.readFileSync(process.argv[2]||'cm/dobset.json','utf8'));
const out=await p.evaluate(data=>{
 const AGEW={marriage:[16,70],children:[16,60],career:[14,85],wealth:[16,90],education:[14,30],jobloss:[16,85],accident:[0,95],healthc:[0,95],finloss:[16,95],bereave:[0,95],divorce:[18,85],studybreak:[10,30]};
 const rel=(a,b)=>((a-b+12)%12)+1,IN=(a,b,set)=>set.includes(rel(a,b));
 const trS=jd=>{const s=siderealAll(jd,SET.ayan);return PL.slice(0,9).map(k=>signOf(s[k]));};
 const trL=jd=>{const s=siderealAll(jd,SET.ayan);return PL.slice(0,9).map(k=>s[k]);};
 const R={}; // rule -> {H,E,V,n}
 const add=(k,hit,base)=>{const r=R[k]=R[k]||{H:0,E:0,V:0,n:0};r.n++;r.H+=hit?1:0;r.E+=base;r.V+=base*(1-base);};
 for(const X of data){const ch=buildChart({...X.inp,noEnrich:true});const N=ch.planets.slice(0,9).map(q=>q.sign),NL=ch.planets.slice(0,9).map(q=>q.lon);
  const fem=X.g==='f',timed=X.tq!=='unknown';
  // Moon sign stable across the day?
  let moonOK=true;if(!timed){const a=buildChart({...X.inp,h:0,mi:5,noEnrich:true}),z=buildChart({...X.inp,h:23,mi:55,noEnrich:true});moonOK=a.planets[1].sign===z.planets[1].sign;}
  const LL=lordOf(ch,1),L7=lordOf(ch,7),lag=ch.lagna,h7=(lag+6)%12,VS=signOf(NL[LL]+NL[L7]);
  const spouseK=fem?2:5,selfK=fem?5:4;const KAR={father:0,mother:1,spouse:spouseK,child:4,sibling:2};
  const mal=T=>[T[6],T[7],T[8]];
  // rules: each returns true/false for (T=transit signs, TL=transit lons, jd) or null if not applicable
  const RULES={
   'BNN marriage: Jupiter 1/5/7/9 from Venus(m)/Mars(f)':{k:['marriage'],f:T=>IN(T[4],N[spouseK],[1,5,7,9])},
   'BNN marriage strict: Jupiter conj Venus(m)/Mars(f)':{k:['marriage'],f:T=>T[4]===N[spouseK]},
   'BNN children: Jupiter 1/5/7/9 from natal Jupiter':{k:['children'],f:T=>IN(T[4],N[4],[1,5,7,9])},
   'BNN career: Jupiter 1/5/7/9 from natal Saturn':{k:['career'],f:T=>IN(T[4],N[6],[1,5,7,9])},
   'BNN career: Saturn 1/5/7/9 from natal Jupiter':{k:['career'],f:T=>IN(T[6],N[4],[1,5,7,9])},
   'BNN job loss: Saturn 1/7 from Saturn or node on Saturn':{k:['jobloss'],f:T=>IN(T[6],N[6],[1,7])||T[7]===N[6]||T[8]===N[6]},
   'BNN bereavement: Sat/Rahu/Ketu 1/7 from relative\'s karaka':{k:['bereave'],f:(T,jd,e)=>{const r=e[3];if(!(r in KAR))return null;if(r==='mother'&&!moonOK)return null;return mal(T).some(s=>IN(s,N[KAR[r]],[1,7]));}},
   'BNN health/accident: Sat/Rahu/Ketu 1/7 from native karaka':{k:['healthc','accident'],f:T=>mal(T).some(s=>IN(s,N[selfK],[1,7]))},
   'BNN divorce: Sat/Rahu/Ketu 1/7 from Venus(m)/Mars(f)':{k:['divorce'],f:T=>mal(T).some(s=>IN(s,N[spouseK],[1,7]))},
   'Classical: Saturn 12/1/2 or 4/8 from Moon (sade sati/dhaiya) for bad events':{k:['jobloss','accident','healthc','finloss','bereave','divorce'],f:T=>moonOK?IN(T[6],N[1],[12,1,2,4,8]):null},
   'KN Rao P3: Jupiter PAC Vivah Saham':{k:['marriage'],t:1,f:T=>IN(T[4],VS,[1,5,7,9])},
   'KN Rao P4: double transit on lagna/7H/LL/7L/VS':{k:['marriage'],t:1,f:T=>{const tg=[lag,h7,N[LL],N[L7],VS];return tg.some(s=>IN(T[4],s,[1,5,7,9]))&&tg.some(s=>IN(T[6],s,[1,4,7,11]));}},
   'KN Rao P5: transit LL and 7L together/opposite':{k:['marriage'],t:1,f:T=>[1,7].includes(rel(T[LL],T[L7]))},
   'KN Rao P7: Sun near lagna or 7H':{k:['marriage'],t:1,f:T=>[12,1,2,6,7,8].includes(rel(T[0],lag))},
   'KN Rao P8: LL near 7H or 7L near lagna':{k:['marriage'],t:1,f:T=>[6,7,8].includes(rel(T[LL],lag))||[12,1,2].includes(rel(T[L7],lag))},
   'KN Rao combined: at least 4 of P3,P4,P5,P7,P8':{k:['marriage'],t:1,f:T=>{const tg=[lag,h7,N[LL],N[L7],VS];let c=0;if(IN(T[4],VS,[1,5,7,9]))c++;if(tg.some(s=>IN(T[4],s,[1,5,7,9]))&&tg.some(s=>IN(T[6],s,[1,4,7,11])))c++;if([1,7].includes(rel(T[LL],T[L7])))c++;if([12,1,2,6,7,8].includes(rel(T[0],lag)))c++;if([6,7,8].includes(rel(T[LL],lag))||[12,1,2].includes(rel(T[L7],lag)))c++;return c>=4;}},
   'KN Rao P1: MD/AD lord linked to lagna/7H/LL/7L (D1)':{k:['marriage'],t:1,f:(T,jd)=>{const d=dashaAt(ch,jd);if(!d)return null;return [d.md.lord,d.ad.lord].some(L=>{if(L===LL||L===L7)return true;const s=N[L];if(s===lag||s===h7||s===N[LL]||s===N[L7])return true;return signAspects(L).some(a=>{const t=(s+a-1)%12;return t===lag||t===h7||t===N[LL]||t===N[L7];});});}},
  };
  for(const [name,R0] of Object.entries(RULES)){if(R0.t&&!timed)continue;
   for(const e of X.ev){if(!R0.k.includes(e[0]))continue;const [y,m,d]=e[1].split('-').map(Number);const jd=julian(y,m,d,12-X.inp.tz);
    const hit=R0.f(trS(jd),jd,e);if(hit===null)continue;
    const w=AGEW[e[0]];let c=0,t=0;for(let a=w[0]*12;a<w[1]*12;a++){const j=ch.jd+(a+0.5)*30.4375;if(X.death){const [dy,dm,dd]=X.death.split('-').map(Number);if(j>julian(dy,dm,dd,0))break;}if(j>julianNow())break;const v=R0.f(trS(j),j,e);if(v===null)continue;t++;if(v)c++;}
    if(!t)continue;add(name,hit,c/t);}}
 }
 return R;},data);
const rows=Object.entries(out).map(([k,r])=>({k,...r,z:(r.H-r.E)/Math.sqrt(r.V||1)}));
rows.forEach(r=>console.log(`${r.k.padEnd(78)} ${String(r.H).padStart(3)}/${String(r.n).padEnd(3)} chance ${r.E.toFixed(1).padStart(5)} (${(100*r.E/r.n).toFixed(0)}%)  z ${r.z>=0?'+':''}${r.z.toFixed(2)}`));
fs.writeFileSync(process.argv[3]||'cm/rules_out.json',JSON.stringify(rows));console.log('ERR',errs.slice(0,3));await b.close();})();
