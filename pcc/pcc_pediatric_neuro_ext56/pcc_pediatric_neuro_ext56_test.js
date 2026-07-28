// Auto-generated test
"use strict";
const {PediatricStrokeRecoveryExt, PediatricAphasiaExt, PediatricDysphagiaExt, PediatricSpasticityExt, PediatricNeurogenicBladderExt, PediatricPoststrokeDepressionExt, PediatricPoststrokeSeizureExt, PediatricMotorRecoveryExt, PediatricCogRehabExt, PediatricSchoolReintegrationExt} = require('./pcc_pediatric_neuro_ext56_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricStrokeRecoveryExt({}).function, 'PediatricStrokeRecoveryExt', 'PediatricStrokeRecoveryExt basic');
assertEq(PediatricAphasiaExt({}).function, 'PediatricAphasiaExt', 'PediatricAphasiaExt basic');
assertEq(PediatricDysphagiaExt({}).function, 'PediatricDysphagiaExt', 'PediatricDysphagiaExt basic');
assertEq(PediatricSpasticityExt({}).function, 'PediatricSpasticityExt', 'PediatricSpasticityExt basic');
assertEq(PediatricNeurogenicBladderExt({}).function, 'PediatricNeurogenicBladderExt', 'PediatricNeurogenicBladderExt basic');
assertEq(PediatricPoststrokeDepressionExt({}).function, 'PediatricPoststrokeDepressionExt', 'PediatricPoststrokeDepressionExt basic');
assertEq(PediatricPoststrokeSeizureExt({}).function, 'PediatricPoststrokeSeizureExt', 'PediatricPoststrokeSeizureExt basic');
assertEq(PediatricMotorRecoveryExt({}).function, 'PediatricMotorRecoveryExt', 'PediatricMotorRecoveryExt basic');
assertEq(PediatricCogRehabExt({}).function, 'PediatricCogRehabExt', 'PediatricCogRehabExt basic');
assertEq(PediatricSchoolReintegrationExt({}).function, 'PediatricSchoolReintegrationExt', 'PediatricSchoolReintegrationExt basic');
console.log('pcc_pediatric_neuro_ext56 unit: ' + passed + ' passed');