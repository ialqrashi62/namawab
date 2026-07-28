// Auto-generated test
"use strict";
const {NeuroOncologyStagingExt, GliomaMolecularMarkerExt, MeningiomaGradingExt, PituitaryAdenomaExt, SchwannomaAssessmentExt, BrainMetastasisExt, PrimaryCNSLymphomaExt, SpinalCordTumorExt, TumorTreatmentResponseExt, NeuroOncRehabilitationExt} = require('./pcc_neuro_ext66_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(NeuroOncologyStagingExt({}).function, 'NeuroOncologyStagingExt', 'NeuroOncologyStagingExt basic');
assertEq(GliomaMolecularMarkerExt({}).function, 'GliomaMolecularMarkerExt', 'GliomaMolecularMarkerExt basic');
assertEq(MeningiomaGradingExt({}).function, 'MeningiomaGradingExt', 'MeningiomaGradingExt basic');
assertEq(PituitaryAdenomaExt({}).function, 'PituitaryAdenomaExt', 'PituitaryAdenomaExt basic');
assertEq(SchwannomaAssessmentExt({}).function, 'SchwannomaAssessmentExt', 'SchwannomaAssessmentExt basic');
assertEq(BrainMetastasisExt({}).function, 'BrainMetastasisExt', 'BrainMetastasisExt basic');
assertEq(PrimaryCNSLymphomaExt({}).function, 'PrimaryCNSLymphomaExt', 'PrimaryCNSLymphomaExt basic');
assertEq(SpinalCordTumorExt({}).function, 'SpinalCordTumorExt', 'SpinalCordTumorExt basic');
assertEq(TumorTreatmentResponseExt({}).function, 'TumorTreatmentResponseExt', 'TumorTreatmentResponseExt basic');
assertEq(NeuroOncRehabilitationExt({}).function, 'NeuroOncRehabilitationExt', 'NeuroOncRehabilitationExt basic');
console.log('pcc_neuro_ext66 unit: ' + passed + ' passed');