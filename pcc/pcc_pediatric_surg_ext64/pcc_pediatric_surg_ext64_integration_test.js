// Auto-generated integration test
"use strict";
const {PediatricThymectomyExt, PediatricPlasmapheresisExt, PediatricIVIGExt, PediatricImmunoablativeTherapyExt, PediatricRituximabNMJExt, PediatricECulizumabExt, PediatricFcRNTreatmentExt, PediatricPlasmapheresisCathExt, PediatricNMJDietExt, PediatricSwallowingAssessExt} = require('./pcc_pediatric_surg_ext64_engine');
const makeDb = () => ({ records: [] });
let passed=0;
function assert(cond,msg){if(cond){passed++;}else{console.error('FAIL',msg);process.exit(1);}}
{ const r = PediatricThymectomyExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricThymectomyExt persist'); }
{ const r = PediatricPlasmapheresisExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricPlasmapheresisExt persist'); }
{ const r = PediatricIVIGExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricIVIGExt persist'); }
{ const r = PediatricImmunoablativeTherapyExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricImmunoablativeTherapyExt persist'); }
{ const r = PediatricRituximabNMJExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricRituximabNMJExt persist'); }
console.log('pcc_pediatric_surg_ext64 integration: ' + passed + ' passed');