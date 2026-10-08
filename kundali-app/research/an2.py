import json,numpy as np
exec(open('cm/an1.py').read().split('# univariate')[0])
# stack
L=np.array([len(x['X']) for x in R]);st=np.concatenate([[0],np.cumsum(L)[:-1]])
XA=np.vstack([x['X'] for x in R]);AGE=np.concatenate([x['age'] for x in R]);EI=st+np.array([x['e'] for x in R])
PI=np.array([x['pi'] for x in R]);PO=np.array([POL[x['T']] for x in R]);TT=[x['T'] for x in R];TQ=np.array([x['tq'] for x in R])
gid=np.repeat(np.arange(len(R)),L)
def pcts(s):
    se=s[EI][gid];lt=np.add.reduceat((s<se).astype(float),st);eq=np.add.reduceat((s==se).astype(float),st)
    return (lt+0.5*eq-0.5)/(L-1)
# age prior: KDE of event ages per type from training persons
def agelog(train_mask,bw=3.0):
    out=np.zeros(len(XA))
    for T in set(TT):
        ages=np.array([R[i]['age'][R[i]['e']] for i in range(len(R)) if TT[i]==T and train_mask[i]])
        rows=np.array([TT[i]==T for i in range(len(R))])[gid]
        if len(ages)==0: continue
        a=AGE[rows];d=np.exp(-0.5*((a[:,None]-ages[None,:])/bw)**2).sum(1)/len(ages)
        out[rows]=np.log(d+1e-3)
    return out
GRID=[-2,-1,-0.5,0,0.5,1,2,3]
def fit(mask,feat,use_age,agl):
    # separate weights for positive and negative polarity
    W={}
    for pol in (1,-1):
        m=mask&(PO==pol)
        if not m.any(): W[pol]=np.zeros(feat.shape[1]+1);continue
        rows=m[gid];w=np.zeros(feat.shape[1]+1);w[-1]=1.0 if use_age else 0
        def obj(w):
            s=feat@w[:-1]+w[-1]*agl
            return pcts(s)[m].mean()
        best=obj(w)
        for sweep in range(3):
            for k in range(feat.shape[1]+ (1 if use_age else 0)):
                for g in GRID:
                    w2=w.copy();w2[k]=g
                    v=obj(w2)
                    if v>best+1e-9:best=v;w=w2
        W[pol]=w
    return W
def score(W,feat,agl):
    s=np.zeros(len(XA))
    for pol in (1,-1):
        rows=(PO==pol)[gid];s[rows]=feat[rows]@W[pol][:-1]+W[pol][-1]*agl[rows]
    return s
def loo(use_astro,use_age):
    feat=XA if use_astro else np.zeros((len(XA),1))
    res=np.zeros(len(R))
    for p in sorted(set(PI)):
        tr=PI!=p;agl=agelog(tr) if use_age else np.zeros(len(XA))
        W=fit(tr,feat,use_age,agl) if use_astro else {1:np.r_[np.zeros(feat.shape[1]),1.0],-1:np.r_[np.zeros(feat.shape[1]),1.0]}
        s=score(W,feat,agl);res[PI==p]=pcts(s)[PI==p]
    return res
def rep(name,r):
    print(f'{name:22s} mean {r.mean()*100:5.1f}  top25 {(r>=0.75).sum()}/{len(r)} ({(r>=0.75).mean()*100:4.1f}%)  pos {r[PO>0].mean()*100:5.1f} neg {r[PO<0].mean()*100:5.1f} | exact {r[TQ=="exact"].mean()*100:5.1f} approx {r[TQ=="approx"].mean()*100:5.1f} unknown {r[TQ=="unknown"].mean()*100:5.1f} | Rohit {r[PI==0].mean()*100:5.1f}')
if __name__=='__main__':
    import sys
    allm=np.ones(len(R),bool)
    # in-sample fit (what you'd get by fitting to everything — optimistic)
    W=fit(allm,XA,False,np.zeros(len(XA)));rep('astro IN-SAMPLE',pcts(score(W,XA,np.zeros(len(XA)))))
    print(' weights pos',dict(zip(FN,W[1][:-1])),'\n weights neg',dict(zip(FN,W[-1][:-1])))
    rep('age only (LOO)',loo(False,True))
    rep('astro only (LOO)',loo(True,False))
    rep('astro+age (LOO)',loo(True,True))
