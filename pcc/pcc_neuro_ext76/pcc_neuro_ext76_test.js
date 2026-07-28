// Auto-generated test
"use strict";
const {VertigoDisorderExt, BPPVExt, VestibularNeuritisExt, MeniereDiseaseExt, AcousticNeuromaExt, VestibularMigraineExt, MotionSicknessExt, BilateralVestibularExt, VEMPTestExt, OcularMotorExamExt} = require('./pcc_neuro_ext76_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(VertigoDisorderExt({}).function, 'VertigoDisorderExt', 'VertigoDisorderExt basic');
assertEq(BPPVExt({}).function, 'BPPVExt', 'BPPVExt basic');
assertEq(VestibularNeuritisExt({}).function, 'VestibularNeuritisExt', 'VestibularNeuritisExt basic');
assertEq(MeniereDiseaseExt({}).function, 'MeniereDiseaseExt', 'MeniereDiseaseExt basic');
assertEq(AcousticNeuromaExt({}).function, 'AcousticNeuromaExt', 'AcousticNeuromaExt basic');
assertEq(VestibularMigraineExt({}).function, 'VestibularMigraineExt', 'VestibularMigraineExt basic');
assertEq(MotionSicknessExt({}).function, 'MotionSicknessExt', 'MotionSicknessExt basic');
assertEq(BilateralVestibularExt({}).function, 'BilateralVestibularExt', 'BilateralVestibularExt basic');
assertEq(VEMPTestExt({}).function, 'VEMPTestExt', 'VEMPTestExt basic');
assertEq(OcularMotorExamExt({}).function, 'OcularMotorExamExt', 'OcularMotorExamExt basic');
console.log('pcc_neuro_ext76 unit: ' + passed + ' passed');