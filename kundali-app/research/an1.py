import json,numpy as np
D=json.load(open('cm/feat.json'));FN=D['F'];P=D['P']
AGEW={'marriage':(16,70),'children':(16,60),'career':(14,85),'wealth':(16,90),'education':(14,30),'jobloss':(16,85),'accident':(0,95),'healthc':(0,95),'finloss':(16,95),'bereave':(0,95),'divorce':(18,85),'studybreak':(10,30)}
POL={'marriage':1,'children':1,'career':1,'wealth':1,'education':1,'jobloss':-1,'accident':-1,'healthc':-1,'finloss':-1,'bereave':-1,'divorce':-1,'studybreak':-1}
# build event records: (person idx, type, X window matrix, event pos in window)
R=[]
for pi,p in enumerate(P):
    for T,mi,ap in p['ev']:
        lo,hi=AGEW[T];a=max(0,lo*12);b=min(p['M'],hi*12)
        if not(a<=mi<b):continue
        X=np.array(p['F'][T][a:b]);R.append(dict(pi=pi,n=p['n'],tq=p['tq'],T=T,X=X,e=mi-a,age=np.arange(a,b)/12.0,ap=ap))
print(len(R),'events in windows')
def pct(s,e):
    v=s[e];return ((s<v).sum()+0.5*(s==v).sum()-0.5)/(len(s)-1)
# univariate
print('feature   all   pos   neg   exact unknown')
for k,f in enumerate(FN):
    r=[(pct(x['X'][:,k],x['e']),POL[x['T']],x['tq']) for x in R]
    a=np.array([v for v,_,_ in r]);po=np.array([v for v,s,_ in r if s>0]);ne=np.array([v for v,s,_ in r if s<0]);ex=np.array([v for v,_,t in r if t=='exact']);un=np.array([v for v,_,t in r if t=='unknown'])
    print(f'{f:7s} {a.mean()*100:5.1f} {po.mean()*100:5.1f} {ne.mean()*100:5.1f} {ex.mean()*100:5.1f} {un.mean()*100:5.1f}')
print('n pos',sum(1 for x in R if POL[x['T']]>0),'neg',sum(1 for x in R if POL[x['T']]<0),'SE of mean pct ~',round(100*0.2887/np.sqrt(len(R)),1))
