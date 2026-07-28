// Auto-generated test
"use strict";
const {CNSInfectionExt, EncephalitisManagementExt, MeningitisAssessmentExt, BrainAbscessExt, SpinalEpiduralAbscessExt, CerebritisExt, PostInfectiousEncephalitisExt, RASMeningitisExt, TuberculousMeningitisExt, FungalMeningitisExt} = require('./pcc_neuro_ext72_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(CNSInfectionExt({}).function, 'CNSInfectionExt', 'CNSInfectionExt basic');
assertEq(EncephalitisManagementExt({}).function, 'EncephalitisManagementExt', 'EncephalitisManagementExt basic');
assertEq(MeningitisAssessmentExt({}).function, 'MeningitisAssessmentExt', 'MeningitisAssessmentExt basic');
assertEq(BrainAbscessExt({}).function, 'BrainAbscessExt', 'BrainAbscessExt basic');
assertEq(SpinalEpiduralAbscessExt({}).function, 'SpinalEpiduralAbscessExt', 'SpinalEpiduralAbscessExt basic');
assertEq(CerebritisExt({}).function, 'CerebritisExt', 'CerebritisExt basic');
assertEq(PostInfectiousEncephalitisExt({}).function, 'PostInfectiousEncephalitisExt', 'PostInfectiousEncephalitisExt basic');
assertEq(RASMeningitisExt({}).function, 'RASMeningitisExt', 'RASMeningitisExt basic');
assertEq(TuberculousMeningitisExt({}).function, 'TuberculousMeningitisExt', 'TuberculousMeningitisExt basic');
assertEq(FungalMeningitisExt({}).function, 'FungalMeningitisExt', 'FungalMeningitisExt basic');
console.log('pcc_neuro_ext72 unit: ' + passed + ' passed');