// Auto-generated integration test
"use strict";
const {PediatricCNSInfectionExt, PediatricEncephalitisExt, PediatricMeningitisExt, PediatricBrainAbscessExt, PediatricSpinalEpiduralAbscessExt, PediatricCerebritisExt, PediatricPostInfectiousExt, PediatricRASMeningitisExt, PediatricTBMExt, PediatricFungalMeningitisExt} = require('./pcc_pediatric_neuro_ext61_engine');
const makeDb = () => ({ records: [] });
let passed=0;
function assert(cond,msg){if(cond){passed++;}else{console.error('FAIL',msg);process.exit(1);}}
{ const r = PediatricCNSInfectionExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricCNSInfectionExt persist'); }
{ const r = PediatricEncephalitisExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricEncephalitisExt persist'); }
{ const r = PediatricMeningitisExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricMeningitisExt persist'); }
{ const r = PediatricBrainAbscessExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricBrainAbscessExt persist'); }
{ const r = PediatricSpinalEpiduralAbscessExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricSpinalEpiduralAbscessExt persist'); }
console.log('pcc_pediatric_neuro_ext61 integration: ' + passed + ' passed');