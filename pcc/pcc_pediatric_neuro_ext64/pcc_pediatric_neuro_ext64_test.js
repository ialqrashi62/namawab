// Auto-generated test
"use strict";
const {PediatricMyastheniaGravisExt, PediatricLambertEatonExt, PediatricMyasthenicCrisisExt, PediatricCholinergicCrisisExt, PediatricOcularMGExt, PediatricThymomaExt, PediatricMUSKAntibodyExt, PediatricLRP4Ext, PediatricSeronegativeMGExt, PediatricMGQOLExt} = require('./pcc_pediatric_neuro_ext64_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricMyastheniaGravisExt({}).function, 'PediatricMyastheniaGravisExt', 'PediatricMyastheniaGravisExt basic');
assertEq(PediatricLambertEatonExt({}).function, 'PediatricLambertEatonExt', 'PediatricLambertEatonExt basic');
assertEq(PediatricMyasthenicCrisisExt({}).function, 'PediatricMyasthenicCrisisExt', 'PediatricMyasthenicCrisisExt basic');
assertEq(PediatricCholinergicCrisisExt({}).function, 'PediatricCholinergicCrisisExt', 'PediatricCholinergicCrisisExt basic');
assertEq(PediatricOcularMGExt({}).function, 'PediatricOcularMGExt', 'PediatricOcularMGExt basic');
assertEq(PediatricThymomaExt({}).function, 'PediatricThymomaExt', 'PediatricThymomaExt basic');
assertEq(PediatricMUSKAntibodyExt({}).function, 'PediatricMUSKAntibodyExt', 'PediatricMUSKAntibodyExt basic');
assertEq(PediatricLRP4Ext({}).function, 'PediatricLRP4Ext', 'PediatricLRP4Ext basic');
assertEq(PediatricSeronegativeMGExt({}).function, 'PediatricSeronegativeMGExt', 'PediatricSeronegativeMGExt basic');
assertEq(PediatricMGQOLExt({}).function, 'PediatricMGQOLExt', 'PediatricMGQOLExt basic');
console.log('pcc_pediatric_neuro_ext64 unit: ' + passed + ' passed');