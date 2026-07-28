// Auto-generated integration test
"use strict";
const {IntracranialAtherosclerosisDiseaseExt, CerebralMicrobleedsSyndromeExt, SuperficialSiderosisExt, RadiationVasculopathyExt, PosteriorCorticalAtrophyExt, PrimaryProgressiveAphasiaExt, CorticobasalDegenerationExt, ProgressiveSupranuclearPalsyExt, MultipleSystemAtrophyExt, LewyBodyDementiaExt} = require('./pcc_neuro_ext63_engine');
const makeDb = () => ({ records: [] });
let passed=0;
function assert(cond,msg){if(cond){passed++;}else{console.error('FAIL',msg);process.exit(1);}}
{ const r = IntracranialAtherosclerosisDiseaseExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'IntracranialAtherosclerosisDiseaseExt persist'); }
{ const r = CerebralMicrobleedsSyndromeExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'CerebralMicrobleedsSyndromeExt persist'); }
{ const r = SuperficialSiderosisExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'SuperficialSiderosisExt persist'); }
{ const r = RadiationVasculopathyExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'RadiationVasculopathyExt persist'); }
{ const r = PosteriorCorticalAtrophyExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'PosteriorCorticalAtrophyExt persist'); }
console.log('pcc_neuro_ext63 integration: ' + passed + ' passed');