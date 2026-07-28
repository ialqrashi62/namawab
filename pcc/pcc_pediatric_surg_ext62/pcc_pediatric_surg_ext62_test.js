// Auto-generated test
"use strict";
const {PediatricICPMonitorExt, PediatricDecompressiveCraniectomyExt, PediatricHematomaEvacuationExt, PediatricCraniotomyTBISurgExt, PediatricCraniectomyBoneFlapExt, PediatricBoneFlapReplacementExt, PediatricDuralRepairExt, PediatricSkullFractureRepairExt, PediatricCerebralBloodFlowExt, PediatricNeurocriticalCareExt} = require('./pcc_pediatric_surg_ext62_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricICPMonitorExt({}).function, 'PediatricICPMonitorExt', 'PediatricICPMonitorExt basic');
assertEq(PediatricDecompressiveCraniectomyExt({}).function, 'PediatricDecompressiveCraniectomyExt', 'PediatricDecompressiveCraniectomyExt basic');
assertEq(PediatricHematomaEvacuationExt({}).function, 'PediatricHematomaEvacuationExt', 'PediatricHematomaEvacuationExt basic');
assertEq(PediatricCraniotomyTBISurgExt({}).function, 'PediatricCraniotomyTBISurgExt', 'PediatricCraniotomyTBISurgExt basic');
assertEq(PediatricCraniectomyBoneFlapExt({}).function, 'PediatricCraniectomyBoneFlapExt', 'PediatricCraniectomyBoneFlapExt basic');
assertEq(PediatricBoneFlapReplacementExt({}).function, 'PediatricBoneFlapReplacementExt', 'PediatricBoneFlapReplacementExt basic');
assertEq(PediatricDuralRepairExt({}).function, 'PediatricDuralRepairExt', 'PediatricDuralRepairExt basic');
assertEq(PediatricSkullFractureRepairExt({}).function, 'PediatricSkullFractureRepairExt', 'PediatricSkullFractureRepairExt basic');
assertEq(PediatricCerebralBloodFlowExt({}).function, 'PediatricCerebralBloodFlowExt', 'PediatricCerebralBloodFlowExt basic');
assertEq(PediatricNeurocriticalCareExt({}).function, 'PediatricNeurocriticalCareExt', 'PediatricNeurocriticalCareExt basic');
console.log('pcc_pediatric_surg_ext62 unit: ' + passed + ' passed');