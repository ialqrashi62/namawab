// Auto-generated test
"use strict";
const {PediatricCNSInfectionExt, PediatricEncephalitisExt, PediatricMeningitisExt, PediatricBrainAbscessExt, PediatricSpinalEpiduralAbscessExt, PediatricCerebritisExt, PediatricPostInfectiousExt, PediatricRASMeningitisExt, PediatricTBMExt, PediatricFungalMeningitisExt} = require('./pcc_pediatric_neuro_ext61_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricCNSInfectionExt({}).function, 'PediatricCNSInfectionExt', 'PediatricCNSInfectionExt basic');
assertEq(PediatricEncephalitisExt({}).function, 'PediatricEncephalitisExt', 'PediatricEncephalitisExt basic');
assertEq(PediatricMeningitisExt({}).function, 'PediatricMeningitisExt', 'PediatricMeningitisExt basic');
assertEq(PediatricBrainAbscessExt({}).function, 'PediatricBrainAbscessExt', 'PediatricBrainAbscessExt basic');
assertEq(PediatricSpinalEpiduralAbscessExt({}).function, 'PediatricSpinalEpiduralAbscessExt', 'PediatricSpinalEpiduralAbscessExt basic');
assertEq(PediatricCerebritisExt({}).function, 'PediatricCerebritisExt', 'PediatricCerebritisExt basic');
assertEq(PediatricPostInfectiousExt({}).function, 'PediatricPostInfectiousExt', 'PediatricPostInfectiousExt basic');
assertEq(PediatricRASMeningitisExt({}).function, 'PediatricRASMeningitisExt', 'PediatricRASMeningitisExt basic');
assertEq(PediatricTBMExt({}).function, 'PediatricTBMExt', 'PediatricTBMExt basic');
assertEq(PediatricFungalMeningitisExt({}).function, 'PediatricFungalMeningitisExt', 'PediatricFungalMeningitisExt basic');
console.log('pcc_pediatric_neuro_ext61 unit: ' + passed + ' passed');