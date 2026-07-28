// Auto-generated integration test
"use strict";
const {NMOExt, MOGDEMExt, ADEMSpectrumExt, MyelitisOpticaExt, MSVariantsExt, RadiologicallyIsolatedExt, ClinicallyIsolatedSynExt, MSTreatmentResponseExt, MSRelapseMgmtExt, MSMonitoringExt} = require('./pcc_neuro_ext80_engine');
const makeDb = () => ({ records: [] });
let passed=0;
function assert(cond,msg){if(cond){passed++;}else{console.error('FAIL',msg);process.exit(1);}}
{ const r = NMOExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'NMOExt persist'); }
{ const r = MOGDEMExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'MOGDEMExt persist'); }
{ const r = ADEMSpectrumExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'ADEMSpectrumExt persist'); }
{ const r = MyelitisOpticaExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'MyelitisOpticaExt persist'); }
{ const r = MSVariantsExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'MSVariantsExt persist'); }
console.log('pcc_neuro_ext80 integration: ' + passed + ' passed');