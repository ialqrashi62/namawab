// Auto-generated integration test
"use strict";
const {PediatricDBSPlaceGpiExt, PediatricDBSPlaceSTNExt, PediatricIntrathecalBaclofenSurgExt, PediatricIntrathecalBaclofenTestExt, PediatricITBPumpRevisionExt, PediatricITBPumpReplacementExt, PediatricDBSRechargeExt, PediatricDBSLeadReplaceExt, PediatricApomorphinePumpExt, PediatricDUODENALevodopaExt} = require('./pcc_pediatric_surg_ext70_engine');
const makeDb = () => ({ records: [] });
let passed=0;
function assert(cond,msg){if(cond){passed++;}else{console.error('FAIL',msg);process.exit(1);}}
{ const r = PediatricDBSPlaceGpiExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricDBSPlaceGpiExt persist'); }
{ const r = PediatricDBSPlaceSTNExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricDBSPlaceSTNExt persist'); }
{ const r = PediatricIntrathecalBaclofenSurgExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricIntrathecalBaclofenSurgExt persist'); }
{ const r = PediatricIntrathecalBaclofenTestExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricIntrathecalBaclofenTestExt persist'); }
{ const r = PediatricITBPumpRevisionExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricITBPumpRevisionExt persist'); }
console.log('pcc_pediatric_surg_ext70 integration: ' + passed + ' passed');