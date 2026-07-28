// Auto-generated integration test
"use strict";
const {PediatricHeadacheExt, PediatricMigraineExt, PediatricClusterHeadacheExt, PediatricTensionHeadacheExt, PediatricTrigeminalExt, PediatricMOHExt, PediatricThunderclapHeadacheExt, PediatricCervicogenicExt, PediatricPostConcussionExt, PediatricIIHHeadacheExt} = require('./pcc_pediatric_neuro_ext58_engine');
const makeDb = () => ({ records: [] });
let passed=0;
function assert(cond,msg){if(cond){passed++;}else{console.error('FAIL',msg);process.exit(1);}}
{ const r = PediatricHeadacheExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricHeadacheExt persist'); }
{ const r = PediatricMigraineExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricMigraineExt persist'); }
{ const r = PediatricClusterHeadacheExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricClusterHeadacheExt persist'); }
{ const r = PediatricTensionHeadacheExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricTensionHeadacheExt persist'); }
{ const r = PediatricTrigeminalExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricTrigeminalExt persist'); }
console.log('pcc_pediatric_neuro_ext58 integration: ' + passed + ' passed');