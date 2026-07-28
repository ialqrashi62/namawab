// filepath: pcc/pcc_neuro_ext98/pcc_neuro_ext98_test.js
const {functions:F}=require('./pcc_neuro_ext98_engine');let pass=0;for(const fn of Object.keys(F)){const r=F[fn]({});if(typeof r.score==='number'&&r.score>=0&&r.score<=1.5)pass++;else console.error('FAIL',fn,r);}console.log('pcc_neuro_ext98 unit:',pass,'passed');if(pass!==10)process.exit(1);
