// Auto-generated test
"use strict";
const {PediatricKetogenicDietExt, PediatricVagusNerveSurgExt, PediatricCallosotomyExt, PediatricHemispherectomyExt, PediatricLesionectomyExt, PediatricLaserAblationExt, PediatricRNSSurgExt, PediatricCordotomyExt, PediatricITBSurgExt, PediatricNeurostimExt} = require('./pcc_pediatric_surg_ext73_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricKetogenicDietExt({}).function, 'PediatricKetogenicDietExt', 'PediatricKetogenicDietExt basic');
assertEq(PediatricVagusNerveSurgExt({}).function, 'PediatricVagusNerveSurgExt', 'PediatricVagusNerveSurgExt basic');
assertEq(PediatricCallosotomyExt({}).function, 'PediatricCallosotomyExt', 'PediatricCallosotomyExt basic');
assertEq(PediatricHemispherectomyExt({}).function, 'PediatricHemispherectomyExt', 'PediatricHemispherectomyExt basic');
assertEq(PediatricLesionectomyExt({}).function, 'PediatricLesionectomyExt', 'PediatricLesionectomyExt basic');
assertEq(PediatricLaserAblationExt({}).function, 'PediatricLaserAblationExt', 'PediatricLaserAblationExt basic');
assertEq(PediatricRNSSurgExt({}).function, 'PediatricRNSSurgExt', 'PediatricRNSSurgExt basic');
assertEq(PediatricCordotomyExt({}).function, 'PediatricCordotomyExt', 'PediatricCordotomyExt basic');
assertEq(PediatricITBSurgExt({}).function, 'PediatricITBSurgExt', 'PediatricITBSurgExt basic');
assertEq(PediatricNeurostimExt({}).function, 'PediatricNeurostimExt', 'PediatricNeurostimExt basic');
console.log('pcc_pediatric_surg_ext73 unit: ' + passed + ' passed');