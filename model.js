const models=require('./models.json');
const mean=a=>a.reduce((s,x)=>s+x,0)/a.length;
function predict(rows,home,away,date){
 const team=t=>rows.filter(r=>r.date<date&&(r.home===t||r.away===t)).sort((a,b)=>a.date.localeCompare(b.date)||a.id-b.id).slice(-20).map(r=>r.home===t?[r.h,r.a,r.draw,r.hx]:[r.a,r.h,r.draw,r.ax]);
 const a=team(home),b=team(away); if(a.length<20||b.length<20)return null;
 const stats=t=>{const x=t.filter(r=>Array.isArray(r[3])&&r[3].every(Number.isFinite));if(x.length<18)return null;return [mean(t.map(r=>r[0])),mean(t.map(r=>r[1])),mean(t.map(r=>r[2])),mean(t.slice(-10).map(r=>r[2])),mean(x.map(r=>r[3][0])),mean(x.map(r=>r[3][1]))]};
 const u=stats(a),v=stats(b);if(!u||!v)return null;
 const f={gap:Math.abs(u[0]-u[1]-v[0]+v[1]),d10:(u[3]+v[3])/2,d20:(u[2]+v[2])/2,total:(u[0]+u[1]+v[0]+v[1])/2,xgap:Math.abs(u[4]-u[5]-v[4]+v[5]),xtotal:(u[4]+u[5]+v[4]+v[5])/2};
 const prob=m=>1/(1+Math.exp(-(m.intercept+m.features.reduce((s,k,i)=>s+(f[k]-m.mean[i])/m.scale[i]*m.coef[i],0))));
 const L=prob(models.L),X=prob(models.X),B=f.gap<=.3+1e-9&&f.d20>=.25-1e-9,H=f.gap<=.5+1e-9&&f.xgap<=.5+1e-9&&f.d10>=.3-1e-9;
 return {L,X,B,H,votes:Number(L>=.275)+Number(X>=.25)+Number(B)+Number(H),avg:(L+X)/2,features:f};
}module.exports={predict};
