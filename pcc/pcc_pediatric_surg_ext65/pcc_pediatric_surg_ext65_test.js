// Auto-generated test
"use strict";
const {PediatricVestibularSurgeryExt, PediatricLabyrinthectomyExt, PediatricEndolymphaticShuntExt, PediatricAcousticNeuromaResectExt, PediatricRetrosigmoidApproachExt, PediatricMiddleFossaApproachExt, PediatricVestibularNerveSectionExt, PediatricHearingRehabExt, PediatricBalanceTherapyExt, PediatricPositionalTrainingExt} = require('./pcc_pediatric_surg_ext65_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricVestibularSurgeryExt({}).function, 'PediatricVestibularSurgeryExt', 'PediatricVestibularSurgeryExt basic');
assertEq(PediatricLabyrinthectomyExt({}).function, 'PediatricLabyrinthectomyExt', 'PediatricLabyrinthectomyExt basic');
assertEq(PediatricEndolymphaticShuntExt({}).function, 'PediatricEndolymphaticShuntExt', 'PediatricEndolymphaticShuntExt basic');
assertEq(PediatricAcousticNeuromaResectExt({}).function, 'PediatricAcousticNeuromaResectExt', 'PediatricAcousticNeuromaResectExt basic');
assertEq(PediatricRetrosigmoidApproachExt({}).function, 'PediatricRetrosigmoidApproachExt', 'PediatricRetrosigmoidApproachExt basic');
assertEq(PediatricMiddleFossaApproachExt({}).function, 'PediatricMiddleFossaApproachExt', 'PediatricMiddleFossaApproachExt basic');
assertEq(PediatricVestibularNerveSectionExt({}).function, 'PediatricVestibularNerveSectionExt', 'PediatricVestibularNerveSectionExt basic');
assertEq(PediatricHearingRehabExt({}).function, 'PediatricHearingRehabExt', 'PediatricHearingRehabExt basic');
assertEq(PediatricBalanceTherapyExt({}).function, 'PediatricBalanceTherapyExt', 'PediatricBalanceTherapyExt basic');
assertEq(PediatricPositionalTrainingExt({}).function, 'PediatricPositionalTrainingExt', 'PediatricPositionalTrainingExt basic');
console.log('pcc_pediatric_surg_ext65 unit: ' + passed + ' passed');