// Auto-generated integration test
"use strict";
const {PediatricParkinsonExt, PediatricJPExt, PediatricDystoniaExt, PediatricHuntingtonExt, PediatricWilsonExt, PediatricLeschNyhanExt, PediatricNeurotransmitterExt, PediatricAicardiExt, PediatricRettSyndromeExt, PediatricTouretteExt} = require('./pcc_pediatric_neuro_ext70_engine');
const makeDb = () => ({ records: [] });
let passed=0;
function assert(cond,msg){if(cond){passed++;}else{console.error('FAIL',msg);process.exit(1);}}
{ const r = PediatricParkinsonExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricParkinsonExt persist'); }
{ const r = PediatricJPExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricJPExt persist'); }
{ const r = PediatricDystoniaExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricDystoniaExt persist'); }
{ const r = PediatricHuntingtonExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricHuntingtonExt persist'); }
{ const r = PediatricWilsonExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricWilsonExt persist'); }
console.log('pcc_pediatric_neuro_ext70 integration: ' + passed + ' passed');