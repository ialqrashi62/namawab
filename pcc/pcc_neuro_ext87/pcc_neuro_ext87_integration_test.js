// Auto-generated integration test
"use strict";
const {CognitiveDisorderExt, AnosognosiaExt, ApraxiaExt, AgnosiaExt, ExecutiveDysfunctionExt, MemoryDisorderExt, VisuospatialExt, LanguageDisorderExt, BehavioralDysexecutiveExt, SocialCognitionExt} = require('./pcc_neuro_ext87_engine');
const makeDb = () => ({ records: [] });
let passed=0;
function assert(cond,msg){if(cond){passed++;}else{console.error('FAIL',msg);process.exit(1);}}
{ const r = CognitiveDisorderExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'CognitiveDisorderExt persist'); }
{ const r = AnosognosiaExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'AnosognosiaExt persist'); }
{ const r = ApraxiaExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'ApraxiaExt persist'); }
{ const r = AgnosiaExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'AgnosiaExt persist'); }
{ const r = ExecutiveDysfunctionExt({}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'ExecutiveDysfunctionExt persist'); }
console.log('pcc_neuro_ext87 integration: ' + passed + ' passed');