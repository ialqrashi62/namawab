// Auto-generated test
"use strict";
const {TBIRehabExt, SpinalCordInjuryRehabExt, StrokeRehabExt, BotulinumToxinExt, FESDeviceProgramExt, PressureUlcerManagementExt, NeurogenicBladderMgmtExt, WheelchairSeatingExt, NeuroAssistiveTechExt, OutpatientNeuroRehabExt} = require('./pcc_neuro_ext78_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(TBIRehabExt({}).function, 'TBIRehabExt', 'TBIRehabExt basic');
assertEq(SpinalCordInjuryRehabExt({}).function, 'SpinalCordInjuryRehabExt', 'SpinalCordInjuryRehabExt basic');
assertEq(StrokeRehabExt({}).function, 'StrokeRehabExt', 'StrokeRehabExt basic');
assertEq(BotulinumToxinExt({}).function, 'BotulinumToxinExt', 'BotulinumToxinExt basic');
assertEq(FESDeviceProgramExt({}).function, 'FESDeviceProgramExt', 'FESDeviceProgramExt basic');
assertEq(PressureUlcerManagementExt({}).function, 'PressureUlcerManagementExt', 'PressureUlcerManagementExt basic');
assertEq(NeurogenicBladderMgmtExt({}).function, 'NeurogenicBladderMgmtExt', 'NeurogenicBladderMgmtExt basic');
assertEq(WheelchairSeatingExt({}).function, 'WheelchairSeatingExt', 'WheelchairSeatingExt basic');
assertEq(NeuroAssistiveTechExt({}).function, 'NeuroAssistiveTechExt', 'NeuroAssistiveTechExt basic');
assertEq(OutpatientNeuroRehabExt({}).function, 'OutpatientNeuroRehabExt', 'OutpatientNeuroRehabExt basic');
console.log('pcc_neuro_ext78 unit: ' + passed + ' passed');