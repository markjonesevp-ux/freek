// Same test with a symmetric chance window (the 5 years before and 6 after), plus a life-stage weight on each area
// (generic weights written down before looking at results, not fitted to these people).
const {chromium}=require('/opt/node22/lib/node_modules/playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve('index.html'));await p.waitForTimeout(400);
const A=JSON.parse(fs.readFileSync('cm/dobset.json','utf8')),B=JSON.parse(fs.readFileSync('cm/marset2.json','utf8'));
const data=[...A.filter(x=>x.tq!=='unknown'),...B];
const out=await p.evaluate(({data})=>{S.lang='en';
 const AW=(k,a)=>({spouse:a<18?0.2:a<22?0.8:a<33?1.5:a<40?1:0.7,children:a<20?0.2:a<24?0.8:a<38?1.5:a<45?0.8:0.6,career:a>=18&&a<=60?1.2:0.6,money:a<16?0.4:1,
  home:a>=25&&a<=60?1.1:0.8,father:a<30?0.8:a<=60?1.2:0.8,health:a<40?0.9:a<=60?1.1:1.4,sudden:a>50?1.2:1}[k]||1);
 const V={base:{},all:{nat:1,kar:1,d9:1,nak:1,moon:1,vl:1,ad:1}};const R={};
 for(const [vn,opt] of Object.entries(V))for(const age of [0,1]){const key=vn+(age?'+age':'');const acc={all:[0,0,0,0],h0:[0,0,0,0],h1:[0,0,0,0]};
  data.forEach((X,pi)=>{const ch=buildChart({...X.inp,gender:X.g,noEnrich:true});
   for(const e of X.ev){const m=SYA_EVA[e[0]];if(!m)continue;const [y,mo,d]=e[1].split('-').map(Number),jd=julian(y,mo,d,12-X.inp.tz);if(jd<ch.jd)continue;
    const ry=runningYearAt(ch,jd),sg=m[1];
    const hit=r2=>{if(r2<1)return null;const r=syaYear(ch,r2,opt);const sc=r.areas.map(a=>({k:a.k,s:a.act*(age?AW(a.k,r2-1):1),t:a.tone})).sort((x,y)=>y.s-x.s);
     const ix=sc.findIndex(x=>x.k===m[0]),a=sc[ix];return ix<4&&(sg===0||(sg<0?a.t<0.25:a.t>-0.25));};
    let c=0,n=0;for(let k=-5;k<=6;k++){if(!k)continue;const v=hit(ry+k);if(v===null)continue;n++;if(v)c++;}if(!n)continue;const h=hit(ry)?1:0,e0=c/n;
    [acc.all,acc['h'+(pi%2)]].forEach(t=>{t[0]++;t[1]+=h;t[2]+=e0;t[3]+=e0*(1-e0);});}});R[key]=acc;}
 return R;},{data});
const f=t=>`${t[1]}/${t[0]} vs ${t[2].toFixed(1)} z ${((t[1]-t[2])/Math.sqrt(t[3]||1)).toFixed(2).padStart(5)}`;
for(const [k,a] of Object.entries(out))console.log(k.padEnd(10),f(a.all).padEnd(26),f(a.h0).padEnd(26),f(a.h1));
console.log('ERR',errs.slice(0,3));await b.close();})();
