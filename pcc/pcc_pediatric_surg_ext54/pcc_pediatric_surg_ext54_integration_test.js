// Auto-generated integration test
"use strict";
const {PediatricDBSPlacementExt, PediatricDBSProgrammingExt, PediatricLesioningSurgeryExt, PediatricPallidotomyExt, PediatricThalamotomyExt, PediatricITBRefillExt, PediatricITBPumpReplacementExt, PediatricVNSPlacementExt, PediatricRNSPlacementExt, PediatricNeuromodulationSurgeryExt} = require('./pcc_pediatric_surg_ext54_engine');
const makeDb = () => ({ records: [] });
let passed=0;
function assert(cond,msg){if(cond){passed++;}else{console.error('FAIL',msg);process.exit(1);}}
{ const r = PediatricDBSPlacementExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricDBSPlacementExt persist'); }
{ const r = PediatricDBSProgrammingExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricDBSProgrammingExt persist'); }
{ const r = PediatricLesioningSurgeryExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricLesioningSurgeryExt persist'); }
{ const r = PediatricPallidotomyExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricPallidotomyExt persist'); }
{ const r = PediatricThalamotomyExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricThalamotomyExt persist'); }
console.log('pcc_pediatric_surg_ext54 integration: ' + passed + ' passed');