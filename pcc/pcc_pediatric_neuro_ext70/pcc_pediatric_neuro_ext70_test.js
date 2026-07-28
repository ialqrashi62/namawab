// Auto-generated test
"use strict";
const {PediatricParkinsonExt, PediatricJPExt, PediatricDystoniaExt, PediatricHuntingtonExt, PediatricWilsonExt, PediatricLeschNyhanExt, PediatricNeurotransmitterExt, PediatricAicardiExt, PediatricRettSyndromeExt, PediatricTouretteExt} = require('./pcc_pediatric_neuro_ext70_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricParkinsonExt({}).function, 'PediatricParkinsonExt', 'PediatricParkinsonExt basic');
assertEq(PediatricJPExt({}).function, 'PediatricJPExt', 'PediatricJPExt basic');
assertEq(PediatricDystoniaExt({}).function, 'PediatricDystoniaExt', 'PediatricDystoniaExt basic');
assertEq(PediatricHuntingtonExt({}).function, 'PediatricHuntingtonExt', 'PediatricHuntingtonExt basic');
assertEq(PediatricWilsonExt({}).function, 'PediatricWilsonExt', 'PediatricWilsonExt basic');
assertEq(PediatricLeschNyhanExt({}).function, 'PediatricLeschNyhanExt', 'PediatricLeschNyhanExt basic');
assertEq(PediatricNeurotransmitterExt({}).function, 'PediatricNeurotransmitterExt', 'PediatricNeurotransmitterExt basic');
assertEq(PediatricAicardiExt({}).function, 'PediatricAicardiExt', 'PediatricAicardiExt basic');
assertEq(PediatricRettSyndromeExt({}).function, 'PediatricRettSyndromeExt', 'PediatricRettSyndromeExt basic');
assertEq(PediatricTouretteExt({}).function, 'PediatricTouretteExt', 'PediatricTouretteExt basic');
console.log('pcc_pediatric_neuro_ext70 unit: ' + passed + ' passed');