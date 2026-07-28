// Auto-generated test
"use strict";
const {PediatricNeurodegenerativeExt, PediatricMovementDisorderExt, PediatricDystoniaClassificationExt, PediatricAtaxiaDiagnosticExt, PediatricChoreaDisorderExt, PediatricTremorPhenotypeExt, PediatricTicDisorderExt, PediatricMyoclonusExt, PediatricParkinsonismExt, PediatricNeuroacanthocytosisExt} = require('./pcc_pediatric_neuro_ext54_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricNeurodegenerativeExt({}).function, 'PediatricNeurodegenerativeExt', 'PediatricNeurodegenerativeExt basic');
assertEq(PediatricMovementDisorderExt({}).function, 'PediatricMovementDisorderExt', 'PediatricMovementDisorderExt basic');
assertEq(PediatricDystoniaClassificationExt({}).function, 'PediatricDystoniaClassificationExt', 'PediatricDystoniaClassificationExt basic');
assertEq(PediatricAtaxiaDiagnosticExt({}).function, 'PediatricAtaxiaDiagnosticExt', 'PediatricAtaxiaDiagnosticExt basic');
assertEq(PediatricChoreaDisorderExt({}).function, 'PediatricChoreaDisorderExt', 'PediatricChoreaDisorderExt basic');
assertEq(PediatricTremorPhenotypeExt({}).function, 'PediatricTremorPhenotypeExt', 'PediatricTremorPhenotypeExt basic');
assertEq(PediatricTicDisorderExt({}).function, 'PediatricTicDisorderExt', 'PediatricTicDisorderExt basic');
assertEq(PediatricMyoclonusExt({}).function, 'PediatricMyoclonusExt', 'PediatricMyoclonusExt basic');
assertEq(PediatricParkinsonismExt({}).function, 'PediatricParkinsonismExt', 'PediatricParkinsonismExt basic');
assertEq(PediatricNeuroacanthocytosisExt({}).function, 'PediatricNeuroacanthocytosisExt', 'PediatricNeuroacanthocytosisExt basic');
console.log('pcc_pediatric_neuro_ext54 unit: ' + passed + ' passed');