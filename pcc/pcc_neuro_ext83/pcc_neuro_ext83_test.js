// Auto-generated test
"use strict";
const {AtaxiaTelangiectasiaExt, FriedreichAtaxiaExt, SpinocerebellarAtaxiaExt, MSAExt, CerebellarAtaxiaExt, SensoryAtaxiaExt, VestibularAtaxiaExt, AtaxiaGeneticExt, AtaxiaRehabExt, AtaxiaMetabolicExt} = require('./pcc_neuro_ext83_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(AtaxiaTelangiectasiaExt({}).function, 'AtaxiaTelangiectasiaExt', 'AtaxiaTelangiectasiaExt basic');
assertEq(FriedreichAtaxiaExt({}).function, 'FriedreichAtaxiaExt', 'FriedreichAtaxiaExt basic');
assertEq(SpinocerebellarAtaxiaExt({}).function, 'SpinocerebellarAtaxiaExt', 'SpinocerebellarAtaxiaExt basic');
assertEq(MSAExt({}).function, 'MSAExt', 'MSAExt basic');
assertEq(CerebellarAtaxiaExt({}).function, 'CerebellarAtaxiaExt', 'CerebellarAtaxiaExt basic');
assertEq(SensoryAtaxiaExt({}).function, 'SensoryAtaxiaExt', 'SensoryAtaxiaExt basic');
assertEq(VestibularAtaxiaExt({}).function, 'VestibularAtaxiaExt', 'VestibularAtaxiaExt basic');
assertEq(AtaxiaGeneticExt({}).function, 'AtaxiaGeneticExt', 'AtaxiaGeneticExt basic');
assertEq(AtaxiaRehabExt({}).function, 'AtaxiaRehabExt', 'AtaxiaRehabExt basic');
assertEq(AtaxiaMetabolicExt({}).function, 'AtaxiaMetabolicExt', 'AtaxiaMetabolicExt basic');
console.log('pcc_neuro_ext83 unit: ' + passed + ' passed');