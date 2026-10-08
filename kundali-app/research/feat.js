const {chromium}=require('/opt/node22/lib/node_modules/playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
await p.goto('file://'+path.resolve('index.html'));await p.waitForTimeout(400);await p.addScriptTag({path:path.resolve('cm/engine.js')});
const data=JSON.parse(fs.readFileSync(process.argv[2]||'cm/dobset.json','utf8'));const out=[];
for(const X of data){const t0=Date.now();
 const r=await p.evaluate(X=>{const S=cmSamples(X.inp,X.tq);const by=X.inp.y,bm=X.inp.m;const now=new Date();let ey,em;
  if(X.death){[ey,em]=X.death.split('-').map(Number);}else{ey=now.getUTCFullYear();em=now.getUTCMonth()+1;}
  const M=(ey-by)*12+(em-bm)+1;const types=[...new Set(X.ev.map(e=>e[0]))].filter(T=>CM_T[T]);const F={};types.forEach(T=>F[T]=[]);
  for(let i=0;i<M;i++){const y=by+Math.floor((bm-1+i)/12),m=(bm-1+i)%12+1;const ds=[julian(y,m,8,12),julian(y,m,23,12)];const ts=ds.map(cmTrSigns);
   types.forEach(T=>{const a=cmFeat(S,T,ds[0],ts[0]),c=cmFeat(S,T,ds[1],ts[1]);const f=(a&&c)?a.map((v,k)=>(v+c[k])/2):(a||c||new Array(CM_F.length).fill(0));F[T].push(f.map(v=>Math.round(v*1000)/1000));});}
  const ev=X.ev.filter(e=>CM_T[e[0]]).map(e=>{const [y,m]=e[1].split('-').map(Number);return [e[0],(y-by)*12+(m-bm),e[2]?1:0];}).filter(e=>e[1]>=0&&e[1]<M);
  return {n:X.n,g:X.g,tq:X.tq,by,bm,M,F,ev,ns:S.length};},X);
 out.push(r);console.log(r.n,r.tq,'samples',r.ns,'months',r.M,'types',Object.keys(r.F).join(','),((Date.now()-t0)/1000).toFixed(1)+'s');}
fs.writeFileSync(process.argv[3]||'cm/feat.json',JSON.stringify({F:await p.evaluate(()=>CM_F),P:out}));console.log('ERR',errs.slice(0,5));await b.close();})();
