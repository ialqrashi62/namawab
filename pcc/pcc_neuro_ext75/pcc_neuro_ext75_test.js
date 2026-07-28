// Auto-generated test
"use strict";
const {MyastheniaGravisExt, LambertEatonExt, MyasthenicCrisisExt, CholinergicCrisisExt, OcularMyastheniaExt, ThymomaAssociatedExt, MUSKAntibodyMGExt, LRP4MGExt, SeronegativeMGExt, MGQOL15Ext} = require('./pcc_neuro_ext75_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(MyastheniaGravisExt({}).function, 'MyastheniaGravisExt', 'MyastheniaGravisExt basic');
assertEq(LambertEatonExt({}).function, 'LambertEatonExt', 'LambertEatonExt basic');
assertEq(MyasthenicCrisisExt({}).function, 'MyasthenicCrisisExt', 'MyasthenicCrisisExt basic');
assertEq(CholinergicCrisisExt({}).function, 'CholinergicCrisisExt', 'CholinergicCrisisExt basic');
assertEq(OcularMyastheniaExt({}).function, 'OcularMyastheniaExt', 'OcularMyastheniaExt basic');
assertEq(ThymomaAssociatedExt({}).function, 'ThymomaAssociatedExt', 'ThymomaAssociatedExt basic');
assertEq(MUSKAntibodyMGExt({}).function, 'MUSKAntibodyMGExt', 'MUSKAntibodyMGExt basic');
assertEq(LRP4MGExt({}).function, 'LRP4MGExt', 'LRP4MGExt basic');
assertEq(SeronegativeMGExt({}).function, 'SeronegativeMGExt', 'SeronegativeMGExt basic');
assertEq(MGQOL15Ext({}).function, 'MGQOL15Ext', 'MGQOL15Ext basic');
console.log('pcc_neuro_ext75 unit: ' + passed + ' passed');