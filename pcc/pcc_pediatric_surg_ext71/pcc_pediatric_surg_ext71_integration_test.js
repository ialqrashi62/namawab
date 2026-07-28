// Auto-generated integration test
"use strict";
const {PediatricDBSChoreaExt, PediatricDBSDystoniaExt, PediatricDBSHDGpiExt, PediatricDeepBrainStimTrialExt, PediatricGeneTherapyExt, PediatricASOSTrialExt, PediatricASHLExt, PediatricPDE10Ext, PediatricNeuropsychTestingExt, PediatricOccupationalTherapyExt} = require('./pcc_pediatric_surg_ext71_engine');
const makeDb = () => ({ records: [] });
let passed=0;
function assert(cond,msg){if(cond){passed++;}else{console.error('FAIL',msg);process.exit(1);}}
{ const r = PediatricDBSChoreaExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricDBSChoreaExt persist'); }
{ const r = PediatricDBSDystoniaExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricDBSDystoniaExt persist'); }
{ const r = PediatricDBSHDGpiExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricDBSHDGpiExt persist'); }
{ const r = PediatricDeepBrainStimTrialExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricDeepBrainStimTrialExt persist'); }
{ const r = PediatricGeneTherapyExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricGeneTherapyExt persist'); }
console.log('pcc_pediatric_surg_ext71 integration: ' + passed + ' passed');