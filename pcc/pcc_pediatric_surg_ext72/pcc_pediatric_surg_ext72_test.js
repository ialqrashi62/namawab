// Auto-generated test
"use strict";
const {PediatricAtaxiaDBSDeepStimExt, PediatricAtaxiaITBSurgExt, PediatricAtaxiaGeneticTestExt, PediatricAtaxiaStemCellExt, PediatricAtaxiaGeneTherapyExt, PediatricAtaxiaPhysioExt, PediatricAtaxiaOTExt, PediatricAtaxiaSpeechExt, PediatricAtaxiaSwallowExt, PediatricAtaxiaAssistiveExt} = require('./pcc_pediatric_surg_ext72_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricAtaxiaDBSDeepStimExt({}).function, 'PediatricAtaxiaDBSDeepStimExt', 'PediatricAtaxiaDBSDeepStimExt basic');
assertEq(PediatricAtaxiaITBSurgExt({}).function, 'PediatricAtaxiaITBSurgExt', 'PediatricAtaxiaITBSurgExt basic');
assertEq(PediatricAtaxiaGeneticTestExt({}).function, 'PediatricAtaxiaGeneticTestExt', 'PediatricAtaxiaGeneticTestExt basic');
assertEq(PediatricAtaxiaStemCellExt({}).function, 'PediatricAtaxiaStemCellExt', 'PediatricAtaxiaStemCellExt basic');
assertEq(PediatricAtaxiaGeneTherapyExt({}).function, 'PediatricAtaxiaGeneTherapyExt', 'PediatricAtaxiaGeneTherapyExt basic');
assertEq(PediatricAtaxiaPhysioExt({}).function, 'PediatricAtaxiaPhysioExt', 'PediatricAtaxiaPhysioExt basic');
assertEq(PediatricAtaxiaOTExt({}).function, 'PediatricAtaxiaOTExt', 'PediatricAtaxiaOTExt basic');
assertEq(PediatricAtaxiaSpeechExt({}).function, 'PediatricAtaxiaSpeechExt', 'PediatricAtaxiaSpeechExt basic');
assertEq(PediatricAtaxiaSwallowExt({}).function, 'PediatricAtaxiaSwallowExt', 'PediatricAtaxiaSwallowExt basic');
assertEq(PediatricAtaxiaAssistiveExt({}).function, 'PediatricAtaxiaAssistiveExt', 'PediatricAtaxiaAssistiveExt basic');
console.log('pcc_pediatric_surg_ext72 unit: ' + passed + ' passed');