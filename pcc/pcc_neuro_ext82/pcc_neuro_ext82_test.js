// Auto-generated test
"use strict";
const {HuntingtonDiseaseExt, HDEyeTrackerExt, HDFunctionalExt, HDNeuropsychExt, HDImagingExt, HDGeneticTestingExt, HDAntidopaminergicExt, HDSRP14003Ext, HDChoreaTreatmentExt, HDBehavioralMgmtExt} = require('./pcc_neuro_ext82_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(HuntingtonDiseaseExt({}).function, 'HuntingtonDiseaseExt', 'HuntingtonDiseaseExt basic');
assertEq(HDEyeTrackerExt({}).function, 'HDEyeTrackerExt', 'HDEyeTrackerExt basic');
assertEq(HDFunctionalExt({}).function, 'HDFunctionalExt', 'HDFunctionalExt basic');
assertEq(HDNeuropsychExt({}).function, 'HDNeuropsychExt', 'HDNeuropsychExt basic');
assertEq(HDImagingExt({}).function, 'HDImagingExt', 'HDImagingExt basic');
assertEq(HDGeneticTestingExt({}).function, 'HDGeneticTestingExt', 'HDGeneticTestingExt basic');
assertEq(HDAntidopaminergicExt({}).function, 'HDAntidopaminergicExt', 'HDAntidopaminergicExt basic');
assertEq(HDSRP14003Ext({}).function, 'HDSRP14003Ext', 'HDSRP14003Ext basic');
assertEq(HDChoreaTreatmentExt({}).function, 'HDChoreaTreatmentExt', 'HDChoreaTreatmentExt basic');
assertEq(HDBehavioralMgmtExt({}).function, 'HDBehavioralMgmtExt', 'HDBehavioralMgmtExt basic');
console.log('pcc_neuro_ext82 unit: ' + passed + ' passed');