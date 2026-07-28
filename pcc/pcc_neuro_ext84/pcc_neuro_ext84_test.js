// Auto-generated test
"use strict";
const {DementiaScreeningExt, AlzheimersDementiaExt, LewyBodyDementiaExt, VascularDementiaExt, FTDBehavioralExt, FTDLanguageExt, PosteriorCorticalAtrophyExt, DLBvsADDExt, DementiaTreatmentExt, DementiaBehavioralExt} = require('./pcc_neuro_ext84_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(DementiaScreeningExt({}).function, 'DementiaScreeningExt', 'DementiaScreeningExt basic');
assertEq(AlzheimersDementiaExt({}).function, 'AlzheimersDementiaExt', 'AlzheimersDementiaExt basic');
assertEq(LewyBodyDementiaExt({}).function, 'LewyBodyDementiaExt', 'LewyBodyDementiaExt basic');
assertEq(VascularDementiaExt({}).function, 'VascularDementiaExt', 'VascularDementiaExt basic');
assertEq(FTDBehavioralExt({}).function, 'FTDBehavioralExt', 'FTDBehavioralExt basic');
assertEq(FTDLanguageExt({}).function, 'FTDLanguageExt', 'FTDLanguageExt basic');
assertEq(PosteriorCorticalAtrophyExt({}).function, 'PosteriorCorticalAtrophyExt', 'PosteriorCorticalAtrophyExt basic');
assertEq(DLBvsADDExt({}).function, 'DLBvsADDExt', 'DLBvsADDExt basic');
assertEq(DementiaTreatmentExt({}).function, 'DementiaTreatmentExt', 'DementiaTreatmentExt basic');
assertEq(DementiaBehavioralExt({}).function, 'DementiaBehavioralExt', 'DementiaBehavioralExt basic');
console.log('pcc_neuro_ext84 unit: ' + passed + ' passed');