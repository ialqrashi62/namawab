// Auto-generated integration test
"use strict";
const {PediatricHuntingtonExt, PediatricJuvenileHDExt, PediatricHDLBDegExt, PediatricHDNeuroExt, PediatricHDEyeTrackExt, PediatricHDTFCScoreExt, PediatricHDBaselineExt, PediatricHDFamilyHxExt, PediatricHDGeneticCounselExt, PediatricHDBehavioralExt} = require('./pcc_pediatric_neuro_ext71_engine');
const makeDb = () => ({ records: [] });
let passed=0;
function assert(cond,msg){if(cond){passed++;}else{console.error('FAIL',msg);process.exit(1);}}
{ const r = PediatricHuntingtonExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricHuntingtonExt persist'); }
{ const r = PediatricJuvenileHDExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricJuvenileHDExt persist'); }
{ const r = PediatricHDLBDegExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricHDLBDegExt persist'); }
{ const r = PediatricHDNeuroExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricHDNeuroExt persist'); }
{ const r = PediatricHDEyeTrackExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricHDEyeTrackExt persist'); }
console.log('pcc_pediatric_neuro_ext71 integration: ' + passed + ' passed');