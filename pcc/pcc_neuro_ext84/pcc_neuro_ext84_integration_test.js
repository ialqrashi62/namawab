// Auto-generated integration test
"use strict";
const {DementiaScreeningExt, AlzheimersDementiaExt, LewyBodyDementiaExt, VascularDementiaExt, FTDBehavioralExt, FTDLanguageExt, PosteriorCorticalAtrophyExt, DLBvsADDExt, DementiaTreatmentExt, DementiaBehavioralExt} = require('./pcc_neuro_ext84_engine');
const makeDb = () => ({ records: [] });
let passed=0;
function assert(cond,msg){if(cond){passed++;}else{console.error('FAIL',msg);process.exit(1);}}
{ const r = DementiaScreeningExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'DementiaScreeningExt persist'); }
{ const r = AlzheimersDementiaExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'AlzheimersDementiaExt persist'); }
{ const r = LewyBodyDementiaExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'LewyBodyDementiaExt persist'); }
{ const r = VascularDementiaExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'VascularDementiaExt persist'); }
{ const r = FTDBehavioralExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'FTDBehavioralExt persist'); }
console.log('pcc_neuro_ext84 integration: ' + passed + ' passed');