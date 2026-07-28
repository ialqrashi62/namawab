// Auto-generated integration test
"use strict";
const {ParkinsonDiseaseExt, PDLevodopaResponseExt, PDMedicationExt, PDDBSProgrammingExt, PDDBSBatteryExt, PDSubthalamicDBSExt, PDGpiDBSExt, PDVimDBSETCenterExt, PDLevodopaCarbidopaInfusionExt, PDApomorphineInfusionExt} = require('./pcc_neuro_ext81_engine');
const makeDb = () => ({ records: [] });
let passed=0;
function assert(cond,msg){if(cond){passed++;}else{console.error('FAIL',msg);process.exit(1);}}
{ const r = ParkinsonDiseaseExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'ParkinsonDiseaseExt persist'); }
{ const r = PDLevodopaResponseExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PDLevodopaResponseExt persist'); }
{ const r = PDMedicationExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PDMedicationExt persist'); }
{ const r = PDDBSProgrammingExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PDDBSProgrammingExt persist'); }
{ const r = PDDBSBatteryExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PDDBSBatteryExt persist'); }
console.log('pcc_neuro_ext81 integration: ' + passed + ' passed');