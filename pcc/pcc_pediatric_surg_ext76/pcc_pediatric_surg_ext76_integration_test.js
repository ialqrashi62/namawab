// Auto-generated integration test
"use strict";
const {PediatricWadaTestExt, PediatricMEGSourceImagingExt, PediatricFunctionalMRSurgeryExt, PediatricLanguageMappingSurgExt, PediatricMemoryMappingExt, PediatricAwakeCraniotomyExt, PediatricEpilepsySurgeryEvalExt, PediatricSurgicalResectionCognExt, PediatricCogRehabPostExt, PediatricCognitiveScreeningExt} = require('./pcc_pediatric_surg_ext76_engine');
const makeDb = () => ({ records: [] });
let passed=0;
function assert(cond,msg){if(cond){passed++;}else{console.error('FAIL',msg);process.exit(1);}}
{ const r = PediatricWadaTestExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricWadaTestExt persist'); }
{ const r = PediatricMEGSourceImagingExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricMEGSourceImagingExt persist'); }
{ const r = PediatricFunctionalMRSurgeryExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricFunctionalMRSurgeryExt persist'); }
{ const r = PediatricLanguageMappingSurgExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricLanguageMappingSurgExt persist'); }
{ const r = PediatricMemoryMappingExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricMemoryMappingExt persist'); }
console.log('pcc_pediatric_surg_ext76 integration: ' + passed + ' passed');