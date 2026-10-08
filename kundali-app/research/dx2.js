// Static yoga lists of the docx vs. real outcomes; Rohit's chart under both documents; checks of the docx's own example charts
const {chromium}=require('/opt/node22/lib/node_modules/playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve('index.html'));await p.waitForTimeout(400);
const ALL=JSON.parse(fs.readFileSync('cm/dobset.json','utf8')),B=JSON.parse(fs.readFileSync('cm/marset2.json','utf8'));
const data=[...ALL.filter(x=>x.tq!=='unknown'),...B];
const out=await p.evaluate(({data})=>{
 const rel=(a,b)=>((a-b+12)%12)+1,MAL=[0,2,6,7,8],BEN=[4,5,3,1],DUAL=[2,5,8,11],NIRB=[1,4,5,7];
 const EXL=[10,33,298,165,95,357,200];
 const A=(X)=>{const ch=buildChart({...X.inp,noEnrich:true}),P=ch.planets,N=P.slice(0,9).map(q=>q.sign),lag=ch.lagna,fem=X.g==='f',hs=h=>(lag+h-1)%12,H=L=>rel(N[L],lag);
  const touch=(L,t)=>N[L]===t||signAspects(L).some(a=>(N[L]+a-1)%12===t),lo=h=>lordOf(ch,h),D9=P.slice(0,9).map(q=>varga(q.lon,9));
  const inH=h=>[...Array(9).keys()].filter(L=>N[L]===hs(h)),infl=t=>[...Array(9).keys()].filter(L=>touch(L,t));
  const conj=(a,c)=>N[a]===N[c],mutual=(a,c)=>conj(a,c)||touch(a,N[c])||touch(c,N[a])||(SIGN_LORD[N[a]]===c&&SIGN_LORD[N[c]]===a);
  const retro=L=>!!(P[L].retro===true||P[L].retro==='R'||P[L].speed<0||P[L].sp<0);
  const V=fem?4:5,L7=lo(7),L2=lo(2),L11=lo(11),L1=lo(1);
  const bahu=[
   ['7L 11th mein dual rashi / 7L-11L sambandh',(H(L7)===11&&DUAL.includes(N[L7]))||mutual(L7,L11)],
   ['7L ya Shukra dual rashi mein (D1 ya D9)',[N[L7],N[5],D9[L7],D9[5]].some(s=>DUAL.includes(s))],
   ['7th mein 2+ grah ya 7L se 3+ grah jude',inH(7).length>=2||[...Array(9).keys()].filter(L=>L!==L7&&mutual(L,L7)).length>=3],
   ['2nd mein 2+ grah ya 2L se 3+ grah jude',inH(2).length>=2||[...Array(9).keys()].filter(L=>L!==L2&&mutual(L,L2)).length>=3],
   ['Shukra-Chandra yuti lagna/7th mein',conj(5,1)&&[1,7].includes(H(5))],
   ['Lagna, lagnesh, 7th, 7L, Shukra sab dual',[lag,N[L1],hs(7),N[L7],N[5]].every(s=>DUAL.includes(s))],
   ['Shukra-Mangal sambandh D1 aur D9 dono mein',(conj(5,2)||touch(2,N[5])||touch(5,N[2]))&&(D9[5]===D9[2]||signAspects(2).some(a=>(D9[2]+a-1)%12===D9[5])||(D9[5]+6)%12===D9[2])],
   ['Budh+Shani 7th mein, 11th mein 2 grah',inH(7).includes(3)&&inH(7).includes(6)&&inH(11).length>=2],
   ['Mahila: Shani+Chandra 7th mein',fem&&inH(7).includes(6)&&inH(7).includes(1)],
   ['7-9-11 bhaav/swami sambandh',mutual(L7,lo(9))&&mutual(lo(9),L11)],
  ];
  const mal8=t=>infl(t).filter(L=>MAL.includes(L)).length;
  const div=[
   ['8th (lagna ya Chandra se) par 3+ grah ka prabhav',infl(hs(8)).length>=3||infl((N[1]+7)%12).length>=3],
   ['Mangal 8th mein 2+ paap ke saath',H(2)===8&&inH(8).filter(L=>MAL.includes(L)&&L!==2).length>=2],
   ['Mangal lagna mein, Rahu/Shani 7th mein',H(2)===1&&(inH(7).includes(7)||inH(7).includes(6))],
   ['Paap 2nd aur 7th dono mein',inH(2).some(L=>MAL.includes(L))&&inH(7).some(L=>MAL.includes(L))],
   ['Paap 6, 7, 8 teeno mein',[6,7,8].every(h=>inH(h).some(L=>MAL.includes(L)))],
   ['2L aur 7L 6/8/12 mein Shukra ke saath',[6,8,12].includes(H(L2))&&[6,8,12].includes(H(L7))&&(conj(L2,5)||conj(L7,5))],
   ['Rahu-Mangal yuti ya Rahu+vakri Guru',conj(7,2)||(conj(7,4)&&retro(4))],
   ['7th lagna se, 7th Chandra se, Shukra teeno peedit',[hs(7),(N[1]+6)%12,N[5]].every(t=>infl(t).some(L=>MAL.includes(L)))],
   ['Alagav-karak (Su/Ra/Sa/12L) 7th par',infl(hs(7)).some(L=>[0,7,6,lo(12)].includes(L))],
  ];
  const unmar=[['Lagnesh, 7L, Shukra teeno nirbeej rashi (2,5,6,8) mein',[N[L1],N[L7],N[5]].every(s=>NIRB.includes(s))]];
  return {ch,P,N,lag,fem,hs,H,touch,lo,D9,inH,infl,bahu,div,unmar,retro};};
 const S=data.map(X=>{const a=A(X);return {n:X.n,g:X.g,nmar:X.ev.filter(e=>e[0]==='marriage').length,div:X.ev.some(e=>e[0]==='divorce')?1:0,
  bahu:a.bahu.filter(x=>x[1]).map(x=>x[0]),divy:a.div.filter(x=>x[1]).map(x=>x[0]),un:a.unmar.filter(x=>x[1]).length};});
 // Rohit + doc example charts in detail
 const det=X=>{const a=A(X),{ch,P,N,lag,hs,H,touch,lo,D9,inH,infl}=a;
  const KAR={1:[0],2:[4],3:[2],4:[1],5:[4],6:[2,6],7:[a.fem?4:5],8:[6],9:[4],10:[0,3,6],11:[4],12:[6]};
  const pure=[...Array(12).keys()].map(i=>i+1).filter(h=>![...Array(9).keys()].some(L=>(L<7||true)&&touch(L,hs(h))));
  const pure7=[...Array(12).keys()].map(i=>i+1).filter(h=>![...Array(7).keys()].some(L=>touch(L,hs(h)))&&!inH(h).length);
  const kar=Object.entries(KAR).map(([h,ks])=>ks.map(k=>{const r=rel(N[k],hs(+h));return `${h}:${PL[k]}@${r}${r===1?'(own-bhava)':[6,8,12].includes(r)?'(6/8/12)':''}`;}).join(',')).join(' ');
  const md=ch.dasha.mds.map((m,i)=>`${i+1}.${PL[m.lord]} ${fdate?fdate(m.start):''}`).join(' | ');
  const avr=[...Array(7).keys()].filter(L=>((P[L].lon-EXL[L]+360)%360)<180).map(L=>PL[L]);
  const deg=P.slice(0,9).map(q=>`${PL[q.i??0]}`);
  const lordRel=[...Array(12).keys()].map(i=>{const h=i+1,L=lo(h);return touch(L,hs(h))?1:0;});
  const benOn=h=>[4,5,3].some(L=>touch(L,hs(h))||touch(L,N[lo(h)]));
  const shubhK=h=>inH(((h+10)%12)+1).some(L=>[4,5,3,1].includes(L))&&inH((h%12)+1).some(L=>[4,5,3,1].includes(L));
  const score=[...Array(12).keys()].map(i=>{const h=i+1;return (lordRel[i]?65:0)+(benOn(h)?20:0)+(shubhK(h)?15:0);});
  const vish=[...Array(9).keys()].filter(L=>{const s=N[L],nv=Math.floor((P[L].lon%30)/(10/3));return ([0,1,5,8].includes(s)&&nv===0)||([2,4,6,10].includes(s)&&nv===4)||([3,7,9,11].includes(s)&&nv===8);}).map(L=>PL[L]);
  const sarpa=[...Array(9).keys()].filter(L=>{const s=N[L],dk=Math.floor((P[L].lon%30)/10);return (s===3&&dk>=1)||(s===7&&dk<=1)||(s===11&&dk===2);}).map(L=>PL[L]);
  const gochara=[...Array(7).keys()].filter(L=>{const d=dignity?dignity(L,N[L]):'';return /ex|own|mt|ucc|swa/i.test(String(d))&&![6,8,12].includes(H(L))&&!P[L].comb;}).map(L=>PL[L]);
  return {n:X.n,lagna:lag,asc:ch.asc,pl:P.slice(0,9).map((q,i)=>`${PL[i]} ${q.sign}:${(q.lon%30).toFixed(2)} H${H(i)}${a.retro(i)?' R':''}`),
   pure_all9:pure,pure_no_nodes:pure7,kar,md,avr,lordRel:lordRel.join(''),score:score.join(','),strong:lordRel.filter(x=>x).length,vish,sarpa,gochara,
   bahu:a.bahu.filter(x=>x[1]).map(x=>x[0]),div:a.div.filter(x=>x[1]).map(x=>x[0]),un:a.unmar.filter(x=>x[1]).map(x=>x[0])};};
 const R=[data[0],{n:'KN Rao (docx)',g:'m',inp:{y:1931,m:10,d:12,h:7,mi:5,lat:16.19,lon:81.14,tz:5.5},ev:[]},
  {n:'Mehsana f 3 vivah (docx)',g:'f',inp:{y:1984,m:6,d:12,h:16,mi:52,lat:23.59,lon:72.38,tz:5.5},ev:[]},
  {n:'Ambala f avivahit (docx)',g:'f',inp:{y:1976,m:8,d:20,h:20,mi:16,lat:30.38,lon:76.78,tz:5.5},ev:[]},
  {n:'Mumbai m alagav (docx)',g:'m',inp:{y:1974,m:10,d:24,h:10,mi:25,lat:19.08,lon:72.88,tz:5.5},ev:[]}].map(det);
 // doc example events: Mars-on-7th/7L at the Mehsana marriages; dasha at Mumbai separation
 const ex=[];{const X={g:'f',inp:{y:1984,m:6,d:12,h:16,mi:52,lat:23.59,lon:72.38,tz:5.5}};const a=A(X);for(const d of ['2002-06-17','2007-01-18','2009-06-29']){const [y,m,dd]=d.split('-').map(Number);const jd=julian(y,m,dd,6.5);const s=siderealAll(jd,SET.ayan),T=PL.slice(0,9).map(k=>signOf(s[k]));const t7=[a.hs(7),a.N[a.lo(7)]];const ds=dashaAt(a.ch,jd);ex.push({d,mars7:t7.some(t=>T[2]===t||signAspects(2).some(o=>(T[2]+o-1)%12===t)),md:PL[ds.md.lord],ad:PL[ds.ad.lord]});}}
 {const X={g:'m',inp:{y:1974,m:10,d:24,h:10,mi:25,lat:19.08,lon:72.88,tz:5.5}};const a=A(X);const jd=julian(2008,12,3,6.5);const ds=dashaAt(a.ch,jd);ex.push({d:'2008-12-03 alagav',md:PL[ds.md.lord],ad:PL[ds.ad.lord],L12:PL[a.lo(12)]});}
 return {S,R,ex};},{data});
const S=out.S;const pct=(a,b)=>b?Math.round(100*a/b)+'%':'-';
const multi=S.filter(s=>s.nmar>1),single=S.filter(s=>s.nmar===1);
console.log('BAHUVIVAH yogas: charts with >=1 yoga — multi-married',multi.filter(s=>s.bahu.length).length+'/'+multi.length,'| married once',single.filter(s=>s.bahu.length).length+'/'+single.length);
console.log('  avg number of yogas: multi',(multi.reduce((a,s)=>a+s.bahu.length,0)/multi.length).toFixed(2),'once',(single.reduce((a,s)=>a+s.bahu.length,0)/single.length).toFixed(2));
const cnt=k=>{const c={};S.forEach(s=>s[k].forEach(y=>c[y]=(c[y]||0)+1));return c;};console.log(cnt('bahu'));
const dv=S.filter(s=>s.div),nd=S.filter(s=>!s.div&&s.nmar);
console.log('DIVORCE yogas: >=1 yoga — divorced',dv.filter(s=>s.divy.length).length+'/'+dv.length,'| not divorced',nd.filter(s=>s.divy.length).length+'/'+nd.length,' avg',(dv.reduce((a,s)=>a+s.divy.length,0)/dv.length).toFixed(2),(nd.reduce((a,s)=>a+s.divy.length,0)/nd.length).toFixed(2));console.log(cnt('divy'));
console.log('UNMARRIED (nirbeej) yoga among MARRIED people:',S.filter(s=>s.nmar&&s.un).length+'/'+S.filter(s=>s.nmar).length);
console.log(JSON.stringify(out.R,null,1));console.log(out.ex);console.log('ERR',errs.slice(0,3));await b.close();})();
