// Auto-generated test
"use strict";
const {PediatricDBSChoreaExt, PediatricDBSDystoniaExt, PediatricDBSHDGpiExt, PediatricDeepBrainStimTrialExt, PediatricGeneTherapyExt, PediatricASOSTrialExt, PediatricASHLExt, PediatricPDE10Ext, PediatricNeuropsychTestingExt, PediatricOccupationalTherapyExt} = require('./pcc_pediatric_surg_ext71_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricDBSChoreaExt({}).function, 'PediatricDBSChoreaExt', 'PediatricDBSChoreaExt basic');
assertEq(PediatricDBSDystoniaExt({}).function, 'PediatricDBSDystoniaExt', 'PediatricDBSDystoniaExt basic');
assertEq(PediatricDBSHDGpiExt({}).function, 'PediatricDBSHDGpiExt', 'PediatricDBSHDGpiExt basic');
assertEq(PediatricDeepBrainStimTrialExt({}).function, 'PediatricDeepBrainStimTrialExt', 'PediatricDeepBrainStimTrialExt basic');
assertEq(PediatricGeneTherapyExt({}).function, 'PediatricGeneTherapyExt', 'PediatricGeneTherapyExt basic');
assertEq(PediatricASOSTrialExt({}).function, 'PediatricASOSTrialExt', 'PediatricASOSTrialExt basic');
assertEq(PediatricASHLExt({}).function, 'PediatricASHLExt', 'PediatricASHLExt basic');
assertEq(PediatricPDE10Ext({}).function, 'PediatricPDE10Ext', 'PediatricPDE10Ext basic');
assertEq(PediatricNeuropsychTestingExt({}).function, 'PediatricNeuropsychTestingExt', 'PediatricNeuropsychTestingExt basic');
assertEq(PediatricOccupationalTherapyExt({}).function, 'PediatricOccupationalTherapyExt', 'PediatricOccupationalTherapyExt basic');
console.log('pcc_pediatric_surg_ext71 unit: ' + passed + ' passed');