// Auto-generated test
"use strict";
const {PediatricTrigeminalSurgeryExt, PediatricMVDExt, PediatricGammaKnifeHeadacheExt, PediatricClusterSurgeryExt, PediatricMigraineSurgeryExt, PediatricOccipitalStimExt, PediatricVCNSSurgeryExt, PediatricBotoxInjectionExt, PediatricHeadacheBlockExt, PediatricPNSMigraineExt} = require('./pcc_pediatric_surg_ext58_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricTrigeminalSurgeryExt({}).function, 'PediatricTrigeminalSurgeryExt', 'PediatricTrigeminalSurgeryExt basic');
assertEq(PediatricMVDExt({}).function, 'PediatricMVDExt', 'PediatricMVDExt basic');
assertEq(PediatricGammaKnifeHeadacheExt({}).function, 'PediatricGammaKnifeHeadacheExt', 'PediatricGammaKnifeHeadacheExt basic');
assertEq(PediatricClusterSurgeryExt({}).function, 'PediatricClusterSurgeryExt', 'PediatricClusterSurgeryExt basic');
assertEq(PediatricMigraineSurgeryExt({}).function, 'PediatricMigraineSurgeryExt', 'PediatricMigraineSurgeryExt basic');
assertEq(PediatricOccipitalStimExt({}).function, 'PediatricOccipitalStimExt', 'PediatricOccipitalStimExt basic');
assertEq(PediatricVCNSSurgeryExt({}).function, 'PediatricVCNSSurgeryExt', 'PediatricVCNSSurgeryExt basic');
assertEq(PediatricBotoxInjectionExt({}).function, 'PediatricBotoxInjectionExt', 'PediatricBotoxInjectionExt basic');
assertEq(PediatricHeadacheBlockExt({}).function, 'PediatricHeadacheBlockExt', 'PediatricHeadacheBlockExt basic');
assertEq(PediatricPNSMigraineExt({}).function, 'PediatricPNSMigraineExt', 'PediatricPNSMigraineExt basic');
console.log('pcc_pediatric_surg_ext58 unit: ' + passed + ' passed');