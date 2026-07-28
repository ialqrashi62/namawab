// Auto-generated test
"use strict";
const {PediatricSMAExt, PediatricSBMAExt, PediatricFSHDExt, PediatricMyotonicDystrophyExt, PediatricLGMDExt, PediatricFacioscapulohumeralExt, PediatricIBMExt, PediatricDermatomyositisExt, PediatricPolymyositisExt, PediatricCongenitalMyopathyExt} = require('./pcc_pediatric_neuro_ext66_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricSMAExt({}).function, 'PediatricSMAExt', 'PediatricSMAExt basic');
assertEq(PediatricSBMAExt({}).function, 'PediatricSBMAExt', 'PediatricSBMAExt basic');
assertEq(PediatricFSHDExt({}).function, 'PediatricFSHDExt', 'PediatricFSHDExt basic');
assertEq(PediatricMyotonicDystrophyExt({}).function, 'PediatricMyotonicDystrophyExt', 'PediatricMyotonicDystrophyExt basic');
assertEq(PediatricLGMDExt({}).function, 'PediatricLGMDExt', 'PediatricLGMDExt basic');
assertEq(PediatricFacioscapulohumeralExt({}).function, 'PediatricFacioscapulohumeralExt', 'PediatricFacioscapulohumeralExt basic');
assertEq(PediatricIBMExt({}).function, 'PediatricIBMExt', 'PediatricIBMExt basic');
assertEq(PediatricDermatomyositisExt({}).function, 'PediatricDermatomyositisExt', 'PediatricDermatomyositisExt basic');
assertEq(PediatricPolymyositisExt({}).function, 'PediatricPolymyositisExt', 'PediatricPolymyositisExt basic');
assertEq(PediatricCongenitalMyopathyExt({}).function, 'PediatricCongenitalMyopathyExt', 'PediatricCongenitalMyopathyExt basic');
console.log('pcc_pediatric_neuro_ext66 unit: ' + passed + ' passed');