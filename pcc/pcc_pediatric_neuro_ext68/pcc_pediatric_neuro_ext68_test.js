// Auto-generated test
"use strict";
const {PediatricObstructiveHydroExt, PediatricCommunicatingHydroExt, PediatricNPHExt, PediatricProgrammableValveExt, PediatricETVExt, PediatricCPCExt, PediatricShuntTapExt, PediatricHydroCognitiveExt, PediatricHydroRehabExt, PediatricHydroBiomarkerExt} = require('./pcc_pediatric_neuro_ext68_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricObstructiveHydroExt({}).function, 'PediatricObstructiveHydroExt', 'PediatricObstructiveHydroExt basic');
assertEq(PediatricCommunicatingHydroExt({}).function, 'PediatricCommunicatingHydroExt', 'PediatricCommunicatingHydroExt basic');
assertEq(PediatricNPHExt({}).function, 'PediatricNPHExt', 'PediatricNPHExt basic');
assertEq(PediatricProgrammableValveExt({}).function, 'PediatricProgrammableValveExt', 'PediatricProgrammableValveExt basic');
assertEq(PediatricETVExt({}).function, 'PediatricETVExt', 'PediatricETVExt basic');
assertEq(PediatricCPCExt({}).function, 'PediatricCPCExt', 'PediatricCPCExt basic');
assertEq(PediatricShuntTapExt({}).function, 'PediatricShuntTapExt', 'PediatricShuntTapExt basic');
assertEq(PediatricHydroCognitiveExt({}).function, 'PediatricHydroCognitiveExt', 'PediatricHydroCognitiveExt basic');
assertEq(PediatricHydroRehabExt({}).function, 'PediatricHydroRehabExt', 'PediatricHydroRehabExt basic');
assertEq(PediatricHydroBiomarkerExt({}).function, 'PediatricHydroBiomarkerExt', 'PediatricHydroBiomarkerExt basic');
console.log('pcc_pediatric_neuro_ext68 unit: ' + passed + ' passed');