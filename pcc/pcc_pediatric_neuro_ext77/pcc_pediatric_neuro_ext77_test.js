// Auto-generated test
"use strict";
const {PediatricMedicalRefractoryExt, PediatricSurgicalEpilepsyExt, PediatricLaserAblationExt, PediatricRNSExt, PediatricDBSForEpilepsyExt, PediatricVNSTuneExt, PediatricKetogenicExt, PediatricACTHExt, PediatricEpilepsyGeneticExt, PediatricSUDEPExt} = require('./pcc_pediatric_neuro_ext77_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricMedicalRefractoryExt({}).function, 'PediatricMedicalRefractoryExt', 'PediatricMedicalRefractoryExt basic');
assertEq(PediatricSurgicalEpilepsyExt({}).function, 'PediatricSurgicalEpilepsyExt', 'PediatricSurgicalEpilepsyExt basic');
assertEq(PediatricLaserAblationExt({}).function, 'PediatricLaserAblationExt', 'PediatricLaserAblationExt basic');
assertEq(PediatricRNSExt({}).function, 'PediatricRNSExt', 'PediatricRNSExt basic');
assertEq(PediatricDBSForEpilepsyExt({}).function, 'PediatricDBSForEpilepsyExt', 'PediatricDBSForEpilepsyExt basic');
assertEq(PediatricVNSTuneExt({}).function, 'PediatricVNSTuneExt', 'PediatricVNSTuneExt basic');
assertEq(PediatricKetogenicExt({}).function, 'PediatricKetogenicExt', 'PediatricKetogenicExt basic');
assertEq(PediatricACTHExt({}).function, 'PediatricACTHExt', 'PediatricACTHExt basic');
assertEq(PediatricEpilepsyGeneticExt({}).function, 'PediatricEpilepsyGeneticExt', 'PediatricEpilepsyGeneticExt basic');
assertEq(PediatricSUDEPExt({}).function, 'PediatricSUDEPExt', 'PediatricSUDEPExt basic');
console.log('pcc_pediatric_neuro_ext77 unit: ' + passed + ' passed');