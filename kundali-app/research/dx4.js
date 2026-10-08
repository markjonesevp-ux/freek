// Navtara (Dr Vivek Mantri sheet) rules vs. real events. Tara = ((planet nak - janma nak) mod 27) mod 9 + 1.
// Transit tests use everyone whose janma nakshatra is certain from the date alone (or timed charts); dasha tests use timed charts only.
const {chromium}=require('/opt/node22/lib/node_modules/playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve('index.html'));await p.waitForTimeout(400);
const A=JSON.parse(fs.readFileSync('cm/dobset.json','utf8')),B=JSON.parse(fs.readFileSync('cm/marset2.json','utf8'));
const data=[...A.map(x=>({...x,set:'A'})),...B.map(x=>({...x,set:'B'}))];
const out=await p.evaluate(({data})=>{
 const AGEW={marriage:[16,70],children:[16,60],career:[14,85],wealth:[16,90],education:[14,30],jobloss:[16,85],accident:[0,95],healthc:[0,95],finloss:[16,95],bereave:[0,95],divorce:[18,85],studybreak:[10,30]};
 const NEG=['jobloss','accident','healthc','finloss','bereave','divorce','studybreak'];
 const nakOf=lon=>Math.floor(norm(lon)/NAKLEN),tara=(n,j)=>((n-j+27)%27)%9+1;
 const trN=jd=>{const s=siderealAll(jd,SET.ayan);return PL.slice(0,9).map(k=>nakOf(s[k]));};
 const AGG={},DET=[],INFO={people:0,timed:0,certain:0};
 const add=(k,hit,base)=>{const r=AGG[k]=AGG[k]||{H:0,E:0,V:0,n:0};r.n++;r.H+=hit?1:0;r.E+=base;r.V+=base*(1-base);};
 for(const X of data){const timed=X.tq!=='unknown';
  // janma nakshatra certain? (unknown time: same nakshatra at 00:00 and 23:59 local)
  let jn;if(timed)jn=buildChart({...X.inp,noEnrich:true}).planets[1].nak;else{const a=buildChart({...X.inp,h:0,mi:0,noEnrich:true}).planets[1].nak,c=buildChart({...X.inp,h:23,mi:59,noEnrich:true}).planets[1].nak;if(a!==c)continue;jn=a;INFO.certain++;}
  INFO.people++;if(timed)INFO.timed++;
  const ch=timed?buildChart({...X.inp,noEnrich:true}):null,NN=ch?ch.planets.slice(0,9).map(q=>q.nak):null;
  const RULES={
   'Gochar Shani Naidhana (7) tara mein — buri ghatna':{neg:1,f:jd=>tara(trN(jd)[6],jn)===7},
   'Gochar Shani Naidhana — sirf rog/mrityu/dhan/naukri':{only:['healthc','bereave','finloss','jobloss'],f:jd=>tara(trN(jd)[6],jn)===7},
   'Gochar Shani kisi buri tara (3/5/7) mein — buri ghatna':{neg:1,f:jd=>[3,5,7].includes(tara(trN(jd)[6],jn))},
   'Gochar Rahu Vipat (3) tara mein — durghatna':{only:'accident',f:jd=>tara(trN(jd)[7],jn)===3},
   'Gochar Rahu Vipat (3) tara mein — koi bhi buri ghatna':{neg:1,f:jd=>tara(trN(jd)[7],jn)===3},
   'Gochar Guru Sampat/Mitra (2/8) mein — achhi ghatna':{pos:1,f:jd=>[2,8].includes(tara(trN(jd)[4],jn))},
   'Gochar Guru kisi achhi tara (2/4/6/8/9) mein — achhi ghatna':{pos:1,f:jd=>[2,4,6,8,9].includes(tara(trN(jd)[4],jn))},
   'Chandra Janma/Vipat/Naidhana (1/3/7) — buri ghatna ka din':{neg:1,day:1,f:jd=>[1,3,7].includes(tara(trN(jd)[1],jn))},
   'Chandra Naidhana (7) — rog/aspatal ka din':{only:'healthc',day:1,f:jd=>tara(trN(jd)[1],jn)===7},
   'Chandra achhi tara (2/4/6/8/9) — achhi ghatna ka din':{pos:1,day:1,f:jd=>[2,4,6,8,9].includes(tara(trN(jd)[1],jn))},
  };
  if(timed){
   RULES['AD swami janm mein buri tara (3/5/7) — buri ghatna']={neg:1,f:jd=>{const d=dashaAt(ch,jd);if(!d)return null;return [3,5,7].includes(tara(NN[d.ad.lord],jn));}};
   RULES['AD swami janm mein achhi tara (2/4/6/8/9) — achhi ghatna']={pos:1,f:jd=>{const d=dashaAt(ch,jd);if(!d)return null;return [2,4,6,8,9].includes(tara(NN[d.ad.lord],jn));}};
   RULES['MD swami janm mein buri tara (3/5/7) — buri ghatna']={neg:1,f:jd=>{const d=dashaAt(ch,jd);if(!d)return null;return [3,5,7].includes(tara(NN[d.md.lord],jn));}};
   RULES['MD buri tara ka swami (janm se 3ri/5vi/7vi MD) — buri ghatna']={neg:1,f:jd=>{const i=ch.dasha.mds.findIndex(m=>jd>=m.start&&jd<m.end);if(i<0)return null;return [2,4,6].includes(i%9);}};
  }
  const det={n:X.n,jn,r:[]};
  for(const e of X.ev){const [y,m,d]=e[1].split('-').map(Number);const tz=X.inp.tz,jd=julian(y,m,d,12-tz),bj=julian(X.inp.y,X.inp.m,X.inp.d,12-tz);
   for(const [name,R0] of Object.entries(RULES)){if(R0.only&&![].concat(R0.only).includes(e[0]))continue;if(R0.neg&&!NEG.includes(e[0]))continue;if(R0.pos&&NEG.includes(e[0]))continue;
    if(R0.day&&e[2])continue; // day-level rules need an exact date
    const hit=R0.f(jd);if(hit===null)continue;let c=0,t=0;
    if(R0.day){for(let k=-300;k<=300;k++){if(!k)continue;const v=R0.f(jd+k*1.21);if(v===null)continue;t++;if(v)c++;}}
    else{const w=AGEW[e[0]];for(let a=w[0]*12;a<w[1]*12;a++){const j=bj+(a+0.5)*30.4375;if(X.death){const [dy,dm,dd]=X.death.split('-').map(Number);if(j>julian(dy,dm,dd,0))break;}if(j>julianNow())break;const v=R0.f(j);if(v===null)continue;t++;if(v)c++;}}
    if(!t)continue;const base=c/t;add(name,hit,base);
    if(X.n.startsWith('Rohit'))det.r.push({ev:e[0]+' '+e[1]+(e[2]?'≈':''),name,hit,base});}}
  if(X.n.startsWith('Rohit')){const tn=trN(julianNow());det.now={sat:tara(tn[6],jn),rahu:tara(tn[7],jn),jup:tara(tn[4],jn)};
   // upcoming Saturn-Naidhana / Rahu-Vipat windows
   const win=(L,tt)=>{const o=[];let on=false,st=0;for(let k=0;k<12*30;k++){const j=julianNow()+k*30.4375;const v=tara(trN(j)[L],jn)===tt;if(v&&!on){on=true;st=j;}if(!v&&on){on=false;o.push(fdate(st)+' → '+fdate(j));}}return o.slice(0,3);};
   det.satN=win(6,7);det.rahuV=win(7,3);det.natal=NN.map((n,i)=>PL[i]+':'+tara(n,jn));
   det.mds=ch.dasha.mds.slice(0,6).map((m,i)=>`${i+1}.${PL[m.lord]}(tara ${tara(NN[m.lord],jn)})`);DET.push(det);}
 }
 return {AGG,DET,INFO};},{data});
fs.writeFileSync('cm/dx4_out.json',JSON.stringify(out));
console.log(out.INFO);
Object.entries(out.AGG).forEach(([nm,r])=>{const z=(r.H-r.E)/Math.sqrt(r.V||1);console.log(`${nm.padEnd(62)} ${String(r.H).padStart(3)}/${String(r.n).padEnd(3)} chance ${r.E.toFixed(1).padStart(5)} (${(100*r.E/r.n).toFixed(0).padStart(2)}%) z ${z>=0?'+':''}${z.toFixed(2)}`);});
console.log('\n=== ROHIT');out.DET.forEach(d=>{console.log('janma nak',d.jn,'now',d.now,'natal',d.natal.join(' '),'\nMDs',d.mds.join(' '),'\nSat Naidhana',d.satN,'\nRahu Vipat',d.rahuV);d.r.forEach(r=>console.log(`${r.ev.padEnd(22)} ${r.hit?'✓':'✗'} ${r.name}  (${Math.round(r.base*100)}%)`));});
console.log('ERR',errs.slice(0,3));await b.close();})();
