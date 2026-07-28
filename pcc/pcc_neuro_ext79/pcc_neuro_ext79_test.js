// Auto-generated test
"use strict";
const {ObstructiveHydrocephalusExt, CommunicatingHydrocephalusExt, NormalPressureHydrocephalusExt, HydrocephalusProgrammableValveExt, EndoscopicThirdVentriculostomyExt, ChoroidPlexusCauterizationExt, HydrocephalusShuntTapExt, HydrocephalusCognitiveExt, HydrocephalusRehabExt, HydrocephalusBiochemicalExt} = require('./pcc_neuro_ext79_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(ObstructiveHydrocephalusExt({}).function, 'ObstructiveHydrocephalusExt', 'ObstructiveHydrocephalusExt basic');
assertEq(CommunicatingHydrocephalusExt({}).function, 'CommunicatingHydrocephalusExt', 'CommunicatingHydrocephalusExt basic');
assertEq(NormalPressureHydrocephalusExt({}).function, 'NormalPressureHydrocephalusExt', 'NormalPressureHydrocephalusExt basic');
assertEq(HydrocephalusProgrammableValveExt({}).function, 'HydrocephalusProgrammableValveExt', 'HydrocephalusProgrammableValveExt basic');
assertEq(EndoscopicThirdVentriculostomyExt({}).function, 'EndoscopicThirdVentriculostomyExt', 'EndoscopicThirdVentriculostomyExt basic');
assertEq(ChoroidPlexusCauterizationExt({}).function, 'ChoroidPlexusCauterizationExt', 'ChoroidPlexusCauterizationExt basic');
assertEq(HydrocephalusShuntTapExt({}).function, 'HydrocephalusShuntTapExt', 'HydrocephalusShuntTapExt basic');
assertEq(HydrocephalusCognitiveExt({}).function, 'HydrocephalusCognitiveExt', 'HydrocephalusCognitiveExt basic');
assertEq(HydrocephalusRehabExt({}).function, 'HydrocephalusRehabExt', 'HydrocephalusRehabExt basic');
assertEq(HydrocephalusBiochemicalExt({}).function, 'HydrocephalusBiochemicalExt', 'HydrocephalusBiochemicalExt basic');
console.log('pcc_neuro_ext79 unit: ' + passed + ' passed');