// Auto-generated test
"use strict";
const {PediatricDementiaScreeningExt, PediatricNiemannPickExt, PediatricTaySachsExt, PediatricBattenDiseaseExt, PediatricLeukodystrophyExt, PediatricALDGenExt, PediatricPKUExt, PediatricMLDExt, PediatricMitochondrialExt, PediatricScreenDevelopmentalExt} = require('./pcc_pediatric_neuro_ext73_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricDementiaScreeningExt({}).function, 'PediatricDementiaScreeningExt', 'PediatricDementiaScreeningExt basic');
assertEq(PediatricNiemannPickExt({}).function, 'PediatricNiemannPickExt', 'PediatricNiemannPickExt basic');
assertEq(PediatricTaySachsExt({}).function, 'PediatricTaySachsExt', 'PediatricTaySachsExt basic');
assertEq(PediatricBattenDiseaseExt({}).function, 'PediatricBattenDiseaseExt', 'PediatricBattenDiseaseExt basic');
assertEq(PediatricLeukodystrophyExt({}).function, 'PediatricLeukodystrophyExt', 'PediatricLeukodystrophyExt basic');
assertEq(PediatricALDGenExt({}).function, 'PediatricALDGenExt', 'PediatricALDGenExt basic');
assertEq(PediatricPKUExt({}).function, 'PediatricPKUExt', 'PediatricPKUExt basic');
assertEq(PediatricMLDExt({}).function, 'PediatricMLDExt', 'PediatricMLDExt basic');
assertEq(PediatricMitochondrialExt({}).function, 'PediatricMitochondrialExt', 'PediatricMitochondrialExt basic');
assertEq(PediatricScreenDevelopmentalExt({}).function, 'PediatricScreenDevelopmentalExt', 'PediatricScreenDevelopmentalExt basic');
console.log('pcc_pediatric_neuro_ext73 unit: ' + passed + ' passed');