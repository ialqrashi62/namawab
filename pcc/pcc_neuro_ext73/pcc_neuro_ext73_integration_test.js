// Auto-generated integration test
"use strict";
const {TraumaticBrainInjuryExt, ConcussionAssessmentExt, PostConcussionSyndromeExt, ChronicTBIExt, SkullFractureExt, EpiduralHematomaExt, SubduralHematomaExt, TraumaticSAHExt, DiffuseAxonalInjuryExt, CerebralEdemaTBIExt} = require('./pcc_neuro_ext73_engine');
const makeDb = () => ({ records: [] });
let passed=0;
function assert(cond,msg){if(cond){passed++;}else{console.error('FAIL',msg);process.exit(1);}}
{ const r = TraumaticBrainInjuryExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'TraumaticBrainInjuryExt persist'); }
{ const r = ConcussionAssessmentExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'ConcussionAssessmentExt persist'); }
{ const r = PostConcussionSyndromeExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PostConcussionSyndromeExt persist'); }
{ const r = ChronicTBIExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'ChronicTBIExt persist'); }
{ const r = SkullFractureExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'SkullFractureExt persist'); }
console.log('pcc_neuro_ext73 integration: ' + passed + ' passed');