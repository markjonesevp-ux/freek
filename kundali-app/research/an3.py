import numpy as np,sys
sys.argv=['x'];exec(open('cm/an2.py').read().split("if __name__=='__main__':")[0])
allm=np.ones(len(R),bool);z=np.zeros(len(XA))
# 1) pipeline sanity: a feature that is 1 only in the event month must score ~100
syn=np.zeros(len(XA));syn[EI]=1;print('sanity synthetic feature pct',round(pcts(syn).mean()*100,1))
# 2) null: move every event to a random month of its own window, refit in-sample
rng=np.random.default_rng(7);EI0=EI.copy();vals=[]
for k in range(4):
    EI=st+np.array([rng.integers(0,l) for l in L])
    W=fit(allm,XA,False,z);vals.append(pcts(score(W,XA,z)).mean()*100);print('random-month in-sample fit',round(vals[-1],1))
EI=EI0
print('feature spread (std) sample:',{f:round(float(XA[:,i].std()),2) for i,f in enumerate(FN[:8])})
