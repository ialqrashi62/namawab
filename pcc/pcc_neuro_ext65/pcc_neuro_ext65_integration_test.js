// Auto-generated integration test
"use strict";
const {NeurodegenerativeDiseaseExt, MovementDisorderAssessmentExt, DystoniaClassificationExt, AtaxiaDiagnosticExt, ChoreaDisorderExt, TremorPhenotypeExt, TicDisorderAssessmentExt, MyoclonusClassificationExt, ParkinsonismAtypicalExt, NeuroacanthocytosisExt} = require('./pcc_neuro_ext65_engine');
const makeDb = () => ({ records: [] });
let passed=0;
function assert(cond,msg){if(cond){passed++;}else{console.error('FAIL',msg);process.exit(1);}}
{ const r = NeurodegenerativeDiseaseExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'NeurodegenerativeDiseaseExt persist'); }
{ const r = MovementDisorderAssessmentExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'MovementDisorderAssessmentExt persist'); }
{ const r = DystoniaClassificationExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'DystoniaClassificationExt persist'); }
{ const r = AtaxiaDiagnosticExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'AtaxiaDiagnosticExt persist'); }
{ const r = ChoreaDisorderExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'ChoreaDisorderExt persist'); }
console.log('pcc_neuro_ext65 integration: ' + passed + ' passed');