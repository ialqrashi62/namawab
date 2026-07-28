// Auto-generated test
"use strict";
const {PediatricVertigoExt, PediatricBPPVExt, PediatricVestibularNeuritisExt, PediatricMeniereExt, PediatricAcousticNeuromaExt, PediatricVestibularMigraineExt, PediatricMotionSicknessExt, PediatricBilateralVestibExt, PediatricVEMPTestExt, PediatricOcularMotorExt} = require('./pcc_pediatric_neuro_ext65_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricVertigoExt({}).function, 'PediatricVertigoExt', 'PediatricVertigoExt basic');
assertEq(PediatricBPPVExt({}).function, 'PediatricBPPVExt', 'PediatricBPPVExt basic');
assertEq(PediatricVestibularNeuritisExt({}).function, 'PediatricVestibularNeuritisExt', 'PediatricVestibularNeuritisExt basic');
assertEq(PediatricMeniereExt({}).function, 'PediatricMeniereExt', 'PediatricMeniereExt basic');
assertEq(PediatricAcousticNeuromaExt({}).function, 'PediatricAcousticNeuromaExt', 'PediatricAcousticNeuromaExt basic');
assertEq(PediatricVestibularMigraineExt({}).function, 'PediatricVestibularMigraineExt', 'PediatricVestibularMigraineExt basic');
assertEq(PediatricMotionSicknessExt({}).function, 'PediatricMotionSicknessExt', 'PediatricMotionSicknessExt basic');
assertEq(PediatricBilateralVestibExt({}).function, 'PediatricBilateralVestibExt', 'PediatricBilateralVestibExt basic');
assertEq(PediatricVEMPTestExt({}).function, 'PediatricVEMPTestExt', 'PediatricVEMPTestExt basic');
assertEq(PediatricOcularMotorExt({}).function, 'PediatricOcularMotorExt', 'PediatricOcularMotorExt basic');
console.log('pcc_pediatric_neuro_ext65 unit: ' + passed + ' passed');