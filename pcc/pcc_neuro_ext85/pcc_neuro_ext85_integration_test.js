// Auto-generated integration test
"use strict";
const {SleepDisorderExt, ObstructiveSleepApneaExt, CentralSleepApneaExt, NarcolepsyAssessmentExt, RestlessLegsExt, REMBehaviorDisorderExt, CircadianDisorderExt, CPAPTherapyExt, SleepStudyExt, SleepHygieneExt} = require('./pcc_neuro_ext85_engine');
const makeDb = () => ({ records: [] });
let passed=0;
function assert(cond,msg){if(cond){passed++;}else{console.error('FAIL',msg);process.exit(1);}}
{ const r = SleepDisorderExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'SleepDisorderExt persist'); }
{ const r = ObstructiveSleepApneaExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'ObstructiveSleepApneaExt persist'); }
{ const r = CentralSleepApneaExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'CentralSleepApneaExt persist'); }
{ const r = NarcolepsyAssessmentExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'NarcolepsyAssessmentExt persist'); }
{ const r = RestlessLegsExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'RestlessLegsExt persist'); }
console.log('pcc_neuro_ext85 integration: ' + passed + ' passed');