// Auto-generated integration test
"use strict";
const {PediatricVenousSinusStentSurgeryExt, PediatricVPShuntTapTestExt, PediatricChiariDecompressionExt, PediatricSyrinxShuntExt, PediatricBasilarInvaginationSurgeryExt, PediatricOccipitalCervicalFusionExt, PediatricVPShuntPlacementExt, PediatricEndoscopicThirdVentriculostomyExt, PediatricCSFDiversionExt, PediatricEndoscopicFenestrationExt} = require('./pcc_pediatric_surg_ext53_engine');
const makeDb = () => ({ records: [] });
let passed=0;
function assert(cond,msg){if(cond){passed++;}else{console.error('FAIL',msg);process.exit(1);}}
{ const r = PediatricVenousSinusStentSurgeryExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricVenousSinusStentSurgeryExt persist'); }
{ const r = PediatricVPShuntTapTestExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricVPShuntTapTestExt persist'); }
{ const r = PediatricChiariDecompressionExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricChiariDecompressionExt persist'); }
{ const r = PediatricSyrinxShuntExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricSyrinxShuntExt persist'); }
{ const r = PediatricBasilarInvaginationSurgeryExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricBasilarInvaginationSurgeryExt persist'); }
console.log('pcc_pediatric_surg_ext53 integration: ' + passed + ' passed');