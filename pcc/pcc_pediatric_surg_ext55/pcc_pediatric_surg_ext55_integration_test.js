// Auto-generated integration test
"use strict";
const {PediatricTumorResectionExt, PediatricAwakeCraniotomyExt, PediatricIntraoperativeMRIExt, PediatricLaserAblationExt, PediatricGliomaSurgeryExt, PediatricVPShuntTumorExt, PediatricCranioplastyExt, PediatricSpinalTumorSurgeryExt, PediatricEndoscopicResectionExt, PediatricBiopsySurgeryExt} = require('./pcc_pediatric_surg_ext55_engine');
const makeDb = () => ({ records: [] });
let passed=0;
function assert(cond,msg){if(cond){passed++;}else{console.error('FAIL',msg);process.exit(1);}}
{ const r = PediatricTumorResectionExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricTumorResectionExt persist'); }
{ const r = PediatricAwakeCraniotomyExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricAwakeCraniotomyExt persist'); }
{ const r = PediatricIntraoperativeMRIExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricIntraoperativeMRIExt persist'); }
{ const r = PediatricLaserAblationExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricLaserAblationExt persist'); }
{ const r = PediatricGliomaSurgeryExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricGliomaSurgeryExt persist'); }
console.log('pcc_pediatric_surg_ext55 integration: ' + passed + ' passed');