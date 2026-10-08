// ---- CM core: time-robust features. Event type → [main houses, supporting houses, karakas, polarity]
const CM_T={marriage:[[7],[2,11],[5,4],1],children:[[5],[2,11,9],[4],1],career:[[10],[11,6,2],[0,6,4,3],1],wealth:[[11],[2,5,9],[4,5,3],1],
 education:[[4],[9,11,5],[3,4],1],property:[[4],[11,2],[2,6],1],vehicle:[[4],[11,2],[5],1],foreign:[[12],[9,3,7],[7,6],1],
 jobloss:[[10],[5,9,12,8],[6,7,8],-1],accident:[[8],[6,12,1],[2,6,7,8],-1],healthc:[[6],[8,12,1],[6,7,2,0],-1],finloss:[[12],[8,6,2],[6,7],-1],
 bereave:[[8],[2,7,12],[6,7,8,2],-1],divorce:[[7],[6,8,12],[5,2,6,7],-1],studybreak:[[4],[3,8,12],[6,7,8],-1]};
const CM_F=['vmdM','vadM','vpdM','vmdL','vadL','vpdL','ymdM','yadM','ymdL','yadL','dpd','juM','saM','dtM','node','mars','sun','sade','juL','saL','adJu','adSa'];
function cmRel(ps,ref,L,T,deep){const [PR,SU,K]=CM_T[T],hof=s=>((s-ref+12)%12)+1;let r=K.includes(L)?1:0,own=0;
 if(L<7){for(let s=0;s<12;s++)if(SIGN_LORD[s]===L){const h=hof(s);own=Math.max(own,PR.includes(h)?1:SU.includes(h)?0.6:0);}}
 else if(!deep)own=0.7*cmRel(ps,ref,SIGN_LORD[ps[L]],T,true);
 const h=hof(ps[L]),occ=PR.includes(h)?0.8:SU.includes(h)?0.5:0,conj=K.some(k=>k!==L&&ps[k]===ps[L])?0.3:0;return Math.min(2,r+own+occ+conj);}
function cmTrHit(sg,asp,ref,PR,SU){let v=0;[0,...asp].forEach(a=>{const s=(sg+(a?a-1:0))%12,h=((s-ref+12)%12)+1;v=Math.max(v,PR.includes(h)?1:SU.includes(h)?0.5:0);});return v;}
const CM_ASP={2:[4,7,8],4:[5,7,9],6:[3,7,10],0:[7]};
// one birth-time sample → what the features need
function cmSample(inp){const ch=buildChart({...inp,noEnrich:true});const ps=ch.planets.slice(0,9).map(p=>p.sign);const yg=yogini(ch);
 const rel={};Object.keys(CM_T).forEach(T=>{rel[T]={M:[...Array(9).keys()].map(L=>cmRel(ps,ps[1],L,T)),L:[...Array(9).keys()].map(L=>cmRel(ps,ch.lagna,L,T))};});
 return {ch,ps,ms:ps[1],ls:ch.lagna,yg,rel,jd:ch.jd};}
function cmSamples(inp,tq){const out=[];const j0=julian(inp.y,inp.m,inp.d,inp.h+inp.mi/60-warTZ(inp));
 if(tq==='exact')out.push(cmSample(inp));else if(tq==='approx'){for(let k=-90;k<=90;k+=30)out.push(cmSample({...inp,jd:j0+k/1440}));}
 else for(let h=1;h<24;h+=2)out.push(cmSample({...inp,h,mi:0}));return out;}
function cmYog(yg,jd){for(const m of yg)if(jd>=m.start&&jd<m.end){for(const a of m.ads)if(jd>=a.start&&jd<a.end)return [YOG_L[m.y],YOG_L[a.y]];return [YOG_L[m.y],YOG_L[m.y]];}return null;}
function cmTrSigns(jd){const s=siderealAll(jd,SET.ayan);return PL.slice(0,9).map(k=>signOf(s[k]));}
// features at one date, averaged over the birth-time samples
function cmFeat(S,T,jd,tsg){const [PR,SU,K,pol]=CM_T[T],f=new Array(CM_F.length).fill(0);let n=0;
 for(const s of S){const d=dashaAt(s.ch,jd);if(!d)continue;const y=cmYog(s.yg,jd)||[d.md.lord,d.ad.lord];const R=s.rel[T];n++;
  const md=d.md.lord,ad=d.ad.lord,pd=d.pd?d.pd.lord:ad;
  f[0]+=R.M[md];f[1]+=R.M[ad];f[2]+=R.M[pd];f[3]+=R.L[md];f[4]+=R.L[ad];f[5]+=R.L[pd];f[6]+=R.M[y[0]];f[7]+=R.M[y[1]];f[8]+=R.L[y[0]];f[9]+=R.L[y[1]];
  const h=((s.ps[ad]-s.ps[md]+12)%12)+1;f[10]+=pol*([6,8,12].includes(h)?-1:[1,5,9,10,11].includes(h)?1:0);
  const kar=K.map(k=>s.ps[k]);const kHit=(sg,asp)=>[0,...asp].some(a=>kar.includes((sg+(a?a-1:0))%12))?0.5:0;
  const ju=Math.min(1.5,cmTrHit(tsg[4],CM_ASP[4],s.ms,PR,SU)+kHit(tsg[4],CM_ASP[4])),sa=Math.min(1.5,cmTrHit(tsg[6],CM_ASP[6],s.ms,PR,SU)+kHit(tsg[6],CM_ASP[6]));
  f[11]+=ju;f[12]+=sa;f[13]+=ju>0&&sa>0?1:0;
  const nd=[tsg[7],tsg[8]].some(sg=>{const hh=((sg-s.ms+12)%12)+1;return PR.includes(hh)||sg===s.ms||kar.includes(sg);});f[14]+=nd?1:0;
  f[15]+=cmTrHit(tsg[2],CM_ASP[2],s.ms,PR,[]);f[16]+=cmTrHit(tsg[0],CM_ASP[0],s.ms,PR,[]);
  const sh=((tsg[6]-s.ms+12)%12)+1;f[17]+=[12,1,2].includes(sh)?1:[4,8].includes(sh)?0.6:0;
  f[18]+=cmTrHit(tsg[4],CM_ASP[4],s.ls,PR,SU);f[19]+=cmTrHit(tsg[6],CM_ASP[6],s.ls,PR,SU);
  f[20]+=R.M[ad]*ju;f[21]+=R.M[ad]*sa;}
 return n?f.map(v=>v/n):null;}
