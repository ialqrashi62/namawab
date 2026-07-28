// Auto-generated test
"use strict";
const {PediatricHuntingtonExt, PediatricJuvenileHDExt, PediatricHDLBDegExt, PediatricHDNeuroExt, PediatricHDEyeTrackExt, PediatricHDTFCScoreExt, PediatricHDBaselineExt, PediatricHDFamilyHxExt, PediatricHDGeneticCounselExt, PediatricHDBehavioralExt} = require('./pcc_pediatric_neuro_ext71_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricHuntingtonExt({}).function, 'PediatricHuntingtonExt', 'PediatricHuntingtonExt basic');
assertEq(PediatricJuvenileHDExt({}).function, 'PediatricJuvenileHDExt', 'PediatricJuvenileHDExt basic');
assertEq(PediatricHDLBDegExt({}).function, 'PediatricHDLBDegExt', 'PediatricHDLBDegExt basic');
assertEq(PediatricHDNeuroExt({}).function, 'PediatricHDNeuroExt', 'PediatricHDNeuroExt basic');
assertEq(PediatricHDEyeTrackExt({}).function, 'PediatricHDEyeTrackExt', 'PediatricHDEyeTrackExt basic');
assertEq(PediatricHDTFCScoreExt({}).function, 'PediatricHDTFCScoreExt', 'PediatricHDTFCScoreExt basic');
assertEq(PediatricHDBaselineExt({}).function, 'PediatricHDBaselineExt', 'PediatricHDBaselineExt basic');
assertEq(PediatricHDFamilyHxExt({}).function, 'PediatricHDFamilyHxExt', 'PediatricHDFamilyHxExt basic');
assertEq(PediatricHDGeneticCounselExt({}).function, 'PediatricHDGeneticCounselExt', 'PediatricHDGeneticCounselExt basic');
assertEq(PediatricHDBehavioralExt({}).function, 'PediatricHDBehavioralExt', 'PediatricHDBehavioralExt basic');
console.log('pcc_pediatric_neuro_ext71 unit: ' + passed + ' passed');