// Auto-generated integration test
"use strict";
const {PediatricAEImmunotherapySurgExt, PediatricRituximabSurgExt, PediatricCyclophosphamideExt, PediatricPlasmaExchangeSurgExt, PediatricIVIGAdminExt, PediatricSteroidPulseSurgExt, PediatricImmunosuppressantExt, PediatricBiologicInfusionExt, PediatricTocilizumabExt, PediatricBortezomibExt} = require('./pcc_pediatric_surg_ext60_engine');
const makeDb = () => ({ records: [] });
let passed=0;
function assert(cond,msg){if(cond){passed++;}else{console.error('FAIL',msg);process.exit(1);}}
{ const r = PediatricAEImmunotherapySurgExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricAEImmunotherapySurgExt persist'); }
{ const r = PediatricRituximabSurgExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricRituximabSurgExt persist'); }
{ const r = PediatricCyclophosphamideExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricCyclophosphamideExt persist'); }
{ const r = PediatricPlasmaExchangeSurgExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricPlasmaExchangeSurgExt persist'); }
{ const r = PediatricIVIGAdminExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricIVIGAdminExt persist'); }
console.log('pcc_pediatric_surg_ext60 integration: ' + passed + ' passed');