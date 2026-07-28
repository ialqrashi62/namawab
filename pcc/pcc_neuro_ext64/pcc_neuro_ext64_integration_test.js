// Auto-generated integration test
"use strict";
const {IdiopathicIntracranialHypertensionExt3, VenousSinusStenosisStentingExt, CSFLeakSiteLocalizationExt, SpontaneousIntracranialHypotensionExt, ChiariMalformationComplexExt, SyringomyeliaMonitoringExt, BasilarInvaginationExt, CraniovertebralJunctionAnomalyExt, CSFFlowDynamicsExt, EmptySellaSyndromeMonitorExt} = require('./pcc_neuro_ext64_engine');
const makeDb = () => ({ records: [] });
let passed=0;
function assert(cond,msg){if(cond){passed++;}else{console.error('FAIL',msg);process.exit(1);}}
{ const r = IdiopathicIntracranialHypertensionExt3({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'IdiopathicIntracranialHypertensionExt3 persist'); }
{ const r = VenousSinusStenosisStentingExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'VenousSinusStenosisStentingExt persist'); }
{ const r = CSFLeakSiteLocalizationExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'CSFLeakSiteLocalizationExt persist'); }
{ const r = SpontaneousIntracranialHypotensionExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'SpontaneousIntracranialHypotensionExt persist'); }
{ const r = ChiariMalformationComplexExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'ChiariMalformationComplexExt persist'); }
console.log('pcc_neuro_ext64 integration: ' + passed + ' passed');