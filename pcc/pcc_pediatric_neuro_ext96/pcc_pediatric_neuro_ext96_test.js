// filepath: pcc/pcc_pediatric_neuro_ext96/pcc_pediatric_neuro_ext96_test.js
const {functions:F}=require('./pcc_pediatric_neuro_ext96_engine');let pass=0;for(const fn of Object.keys(F)){const r=F[fn]({});if(typeof r.score==='number'&&r.score>=0&&r.score<=1.5)pass++;else console.error('FAIL',fn,r);}console.log('pcc_pediatric_neuro_ext96 unit:',pass,'passed');if(pass!==10)process.exit(1);
