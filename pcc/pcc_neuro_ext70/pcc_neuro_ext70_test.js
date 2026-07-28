// Auto-generated test
"use strict";
const {MultipleSclerosisPhenotypeExt, MSRelapseAssessmentExt, MSProgressionExt, DMTManagementExt, NMOSDAssessmentExt, MOGAntibodyExt, ADEMAssessmentExt, OpticNeuritisExt, TransverseMyelitisExt, NeuroRehabMSExt} = require('./pcc_neuro_ext70_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(MultipleSclerosisPhenotypeExt({}).function, 'MultipleSclerosisPhenotypeExt', 'MultipleSclerosisPhenotypeExt basic');
assertEq(MSRelapseAssessmentExt({}).function, 'MSRelapseAssessmentExt', 'MSRelapseAssessmentExt basic');
assertEq(MSProgressionExt({}).function, 'MSProgressionExt', 'MSProgressionExt basic');
assertEq(DMTManagementExt({}).function, 'DMTManagementExt', 'DMTManagementExt basic');
assertEq(NMOSDAssessmentExt({}).function, 'NMOSDAssessmentExt', 'NMOSDAssessmentExt basic');
assertEq(MOGAntibodyExt({}).function, 'MOGAntibodyExt', 'MOGAntibodyExt basic');
assertEq(ADEMAssessmentExt({}).function, 'ADEMAssessmentExt', 'ADEMAssessmentExt basic');
assertEq(OpticNeuritisExt({}).function, 'OpticNeuritisExt', 'OpticNeuritisExt basic');
assertEq(TransverseMyelitisExt({}).function, 'TransverseMyelitisExt', 'TransverseMyelitisExt basic');
assertEq(NeuroRehabMSExt({}).function, 'NeuroRehabMSExt', 'NeuroRehabMSExt basic');
console.log('pcc_neuro_ext70 unit: ' + passed + ' passed');