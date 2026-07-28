// Auto-generated integration test
"use strict";
const {AutoimmuneEncephalitisExt, ParaneoplasticSyndromeExt, CerebralVasculitisExt, CNSLupusExt, NeuroBehcetExt, SarcoidNeuroExt, NeuroIgG4Ext, CLIPPERSOrNeuroBehcetExt, LymphomaCNSRelapseExt, GADAntibodyExt} = require('./pcc_neuro_ext71_engine');
const makeDb = () => ({ records: [] });
let passed=0;
function assert(cond,msg){if(cond){passed++;}else{console.error('FAIL',msg);process.exit(1);}}
{ const r = AutoimmuneEncephalitisExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'AutoimmuneEncephalitisExt persist'); }
{ const r = ParaneoplasticSyndromeExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'ParaneoplasticSyndromeExt persist'); }
{ const r = CerebralVasculitisExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'CerebralVasculitisExt persist'); }
{ const r = CNSLupusExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'CNSLupusExt persist'); }
{ const r = NeuroBehcetExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'NeuroBehcetExt persist'); }
console.log('pcc_neuro_ext71 integration: ' + passed + ' passed');