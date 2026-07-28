// Auto-generated test
"use strict";
const {PediatricATExt, PediatricFAExt, PediatricSCAExt, PediatricMSAExt, PediatricCerebellarAtaxiaExt, PediatricSensoryAtaxiaExt, PediatricVestibularAtaxiaExt, PediatricAtaxiaGeneticExt, PediatricAtaxiaRehabExt, PediatricAtaxiaMetabolicExt} = require('./pcc_pediatric_neuro_ext72_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricATExt({}).function, 'PediatricATExt', 'PediatricATExt basic');
assertEq(PediatricFAExt({}).function, 'PediatricFAExt', 'PediatricFAExt basic');
assertEq(PediatricSCAExt({}).function, 'PediatricSCAExt', 'PediatricSCAExt basic');
assertEq(PediatricMSAExt({}).function, 'PediatricMSAExt', 'PediatricMSAExt basic');
assertEq(PediatricCerebellarAtaxiaExt({}).function, 'PediatricCerebellarAtaxiaExt', 'PediatricCerebellarAtaxiaExt basic');
assertEq(PediatricSensoryAtaxiaExt({}).function, 'PediatricSensoryAtaxiaExt', 'PediatricSensoryAtaxiaExt basic');
assertEq(PediatricVestibularAtaxiaExt({}).function, 'PediatricVestibularAtaxiaExt', 'PediatricVestibularAtaxiaExt basic');
assertEq(PediatricAtaxiaGeneticExt({}).function, 'PediatricAtaxiaGeneticExt', 'PediatricAtaxiaGeneticExt basic');
assertEq(PediatricAtaxiaRehabExt({}).function, 'PediatricAtaxiaRehabExt', 'PediatricAtaxiaRehabExt basic');
assertEq(PediatricAtaxiaMetabolicExt({}).function, 'PediatricAtaxiaMetabolicExt', 'PediatricAtaxiaMetabolicExt basic');
console.log('pcc_pediatric_neuro_ext72 unit: ' + passed + ' passed');