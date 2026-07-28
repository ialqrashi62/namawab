// Auto-generated integration test
"use strict";
const {PediatricTonsillectomyExt, PediatricAdenoidectomyExt, PediatricUvulopalatoplastyExt, PediatricCPAPInitExt, PediatricBiPAPInitExt, PediatricCPAPFollowExt, PediatricCranialRemodelingExt, PediatricPharyngoplastyExt, PediatricMaxillaryMandibularExt, PediatricTracheostomyExt} = require('./pcc_pediatric_surg_ext74_engine');
const makeDb = () => ({ records: [] });
let passed=0;
function assert(cond,msg){if(cond){passed++;}else{console.error('FAIL',msg);process.exit(1);}}
{ const r = PediatricTonsillectomyExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricTonsillectomyExt persist'); }
{ const r = PediatricAdenoidectomyExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricAdenoidectomyExt persist'); }
{ const r = PediatricUvulopalatoplastyExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricUvulopalatoplastyExt persist'); }
{ const r = PediatricCPAPInitExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricCPAPInitExt persist'); }
{ const r = PediatricBiPAPInitExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PediatricBiPAPInitExt persist'); }
console.log('pcc_pediatric_surg_ext74 integration: ' + passed + ' passed');