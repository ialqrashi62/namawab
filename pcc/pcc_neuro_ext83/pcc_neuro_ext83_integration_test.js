// Auto-generated integration test
"use strict";
const {AtaxiaTelangiectasiaExt, FriedreichAtaxiaExt, SpinocerebellarAtaxiaExt, MSAExt, CerebellarAtaxiaExt, SensoryAtaxiaExt, VestibularAtaxiaExt, AtaxiaGeneticExt, AtaxiaRehabExt, AtaxiaMetabolicExt} = require('./pcc_neuro_ext83_engine');
const makeDb = () => ({ records: [] });
let passed=0;
function assert(cond,msg){if(cond){passed++;}else{console.error('FAIL',msg);process.exit(1);}}
{ const r = AtaxiaTelangiectasiaExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'AtaxiaTelangiectasiaExt persist'); }
{ const r = FriedreichAtaxiaExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'FriedreichAtaxiaExt persist'); }
{ const r = SpinocerebellarAtaxiaExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'SpinocerebellarAtaxiaExt persist'); }
{ const r = MSAExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'MSAExt persist'); }
{ const r = CerebellarAtaxiaExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'CerebellarAtaxiaExt persist'); }
console.log('pcc_neuro_ext83 integration: ' + passed + ' passed');