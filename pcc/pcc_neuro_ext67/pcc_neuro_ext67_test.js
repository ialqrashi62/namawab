// Auto-generated test
"use strict";
const {StrokeRecoveryAssessmentExt, AphasiaAssessmentExt, DysphagiaManagementExt, SpasticityTreatmentExt, NeurogenicBladderExt, PoststrokeDepressionExt, PoststrokeSeizureExt, MotorRecoveryTrackingExt, CognitiveRehabExt, VocationalRehabExt} = require('./pcc_neuro_ext67_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(StrokeRecoveryAssessmentExt({}).function, 'StrokeRecoveryAssessmentExt', 'StrokeRecoveryAssessmentExt basic');
assertEq(AphasiaAssessmentExt({}).function, 'AphasiaAssessmentExt', 'AphasiaAssessmentExt basic');
assertEq(DysphagiaManagementExt({}).function, 'DysphagiaManagementExt', 'DysphagiaManagementExt basic');
assertEq(SpasticityTreatmentExt({}).function, 'SpasticityTreatmentExt', 'SpasticityTreatmentExt basic');
assertEq(NeurogenicBladderExt({}).function, 'NeurogenicBladderExt', 'NeurogenicBladderExt basic');
assertEq(PoststrokeDepressionExt({}).function, 'PoststrokeDepressionExt', 'PoststrokeDepressionExt basic');
assertEq(PoststrokeSeizureExt({}).function, 'PoststrokeSeizureExt', 'PoststrokeSeizureExt basic');
assertEq(MotorRecoveryTrackingExt({}).function, 'MotorRecoveryTrackingExt', 'MotorRecoveryTrackingExt basic');
assertEq(CognitiveRehabExt({}).function, 'CognitiveRehabExt', 'CognitiveRehabExt basic');
assertEq(VocationalRehabExt({}).function, 'VocationalRehabExt', 'VocationalRehabExt basic');
console.log('pcc_neuro_ext67 unit: ' + passed + ' passed');