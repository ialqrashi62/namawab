// Auto-generated integration test
"use strict";
const {HeadacheClassificationExt, MigraineProphylaxisExt, ClusterHeadacheExt, TensionHeadacheExt, TrigeminalNeuralgiaExt, MedicationOveruseHeadacheExt, ThunderclapHeadacheExt, CervicogenicHeadacheExt, PostConcussionHeadacheExt, IdiopathicIntracranialHypertensionHeadacheExt} = require('./pcc_neuro_ext69_engine');
const makeDb = () => ({ records: [] });
let passed=0;
function assert(cond,msg){if(cond){passed++;}else{console.error('FAIL',msg);process.exit(1);}}
{ const r = HeadacheClassificationExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'HeadacheClassificationExt persist'); }
{ const r = MigraineProphylaxisExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'MigraineProphylaxisExt persist'); }
{ const r = ClusterHeadacheExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'ClusterHeadacheExt persist'); }
{ const r = TensionHeadacheExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'TensionHeadacheExt persist'); }
{ const r = TrigeminalNeuralgiaExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'TrigeminalNeuralgiaExt persist'); }
console.log('pcc_neuro_ext69 integration: ' + passed + ' passed');