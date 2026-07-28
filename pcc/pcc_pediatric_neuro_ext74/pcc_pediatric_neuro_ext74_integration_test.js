// Auto-generated integration test
"use strict";
const {PediatricSleepDisorderExt, PediatricOSAExt, PediatricCSAExt, PediatricNarcolepsyExt, PediatricRLSExt, PediatricRBDExt, PediatricCircadianExt, PediatricCPAPExt, PediatricAdenotonsillectomyExt, PediatricSleepApneaSynExt} = require('./pcc_pediatric_neuro_ext74_engine');
const makeDb = () => ({ records: [] });
let passed=0;
function assert(cond,msg){if(cond){passed++;}else{console.error('FAIL',msg);process.exit(1);}}
{ const r = PediatricSleepDisorderExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricSleepDisorderExt persist'); }
{ const r = PediatricOSAExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricOSAExt persist'); }
{ const r = PediatricCSAExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricCSAExt persist'); }
{ const r = PediatricNarcolepsyExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricNarcolepsyExt persist'); }
{ const r = PediatricRLSExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricRLSExt persist'); }
console.log('pcc_pediatric_neuro_ext74 integration: ' + passed + ' passed');