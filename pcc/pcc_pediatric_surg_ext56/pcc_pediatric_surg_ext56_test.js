// Auto-generated test
"use strict";
const {PediatricSelectiveDorsalRhizotomyExt, PediatricIntrathecalBaclofenSurgeryExt, PediatricTendonLengtheningExt, PediatricBotulinumInjectionSurgeryExt, PediatricOrthopedicSpineSurgeryExt, PediatricHipReconstructionExt, PediatricGaitSurgeryExt, PediatricUpperLimbSurgeryExt, PediatricSpasticitySurgeryExt, PediatricCerebralPalsySurgeryExt} = require('./pcc_pediatric_surg_ext56_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricSelectiveDorsalRhizotomyExt({}).function, 'PediatricSelectiveDorsalRhizotomyExt', 'PediatricSelectiveDorsalRhizotomyExt basic');
assertEq(PediatricIntrathecalBaclofenSurgeryExt({}).function, 'PediatricIntrathecalBaclofenSurgeryExt', 'PediatricIntrathecalBaclofenSurgeryExt basic');
assertEq(PediatricTendonLengtheningExt({}).function, 'PediatricTendonLengtheningExt', 'PediatricTendonLengtheningExt basic');
assertEq(PediatricBotulinumInjectionSurgeryExt({}).function, 'PediatricBotulinumInjectionSurgeryExt', 'PediatricBotulinumInjectionSurgeryExt basic');
assertEq(PediatricOrthopedicSpineSurgeryExt({}).function, 'PediatricOrthopedicSpineSurgeryExt', 'PediatricOrthopedicSpineSurgeryExt basic');
assertEq(PediatricHipReconstructionExt({}).function, 'PediatricHipReconstructionExt', 'PediatricHipReconstructionExt basic');
assertEq(PediatricGaitSurgeryExt({}).function, 'PediatricGaitSurgeryExt', 'PediatricGaitSurgeryExt basic');
assertEq(PediatricUpperLimbSurgeryExt({}).function, 'PediatricUpperLimbSurgeryExt', 'PediatricUpperLimbSurgeryExt basic');
assertEq(PediatricSpasticitySurgeryExt({}).function, 'PediatricSpasticitySurgeryExt', 'PediatricSpasticitySurgeryExt basic');
assertEq(PediatricCerebralPalsySurgeryExt({}).function, 'PediatricCerebralPalsySurgeryExt', 'PediatricCerebralPalsySurgeryExt basic');
console.log('pcc_pediatric_surg_ext56 unit: ' + passed + ' passed');