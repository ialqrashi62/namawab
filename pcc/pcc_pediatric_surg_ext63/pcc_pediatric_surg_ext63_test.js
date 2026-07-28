// Auto-generated test
"use strict";
const {PediatricNerveSurgeryExt, PediatricNerveRepairExt, PediatricNerveTransferExt, PediatricPlantarReleaseExt, PediatricTendonTransferExt, PediatricTarsalTunnelExt, PediatricNeurolysisExt, PediatricMuscleBiopsySurgExt, PediatricSpinalCordDetetherExt, PediatricCRMOOrthoticExt} = require('./pcc_pediatric_surg_ext63_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricNerveSurgeryExt({}).function, 'PediatricNerveSurgeryExt', 'PediatricNerveSurgeryExt basic');
assertEq(PediatricNerveRepairExt({}).function, 'PediatricNerveRepairExt', 'PediatricNerveRepairExt basic');
assertEq(PediatricNerveTransferExt({}).function, 'PediatricNerveTransferExt', 'PediatricNerveTransferExt basic');
assertEq(PediatricPlantarReleaseExt({}).function, 'PediatricPlantarReleaseExt', 'PediatricPlantarReleaseExt basic');
assertEq(PediatricTendonTransferExt({}).function, 'PediatricTendonTransferExt', 'PediatricTendonTransferExt basic');
assertEq(PediatricTarsalTunnelExt({}).function, 'PediatricTarsalTunnelExt', 'PediatricTarsalTunnelExt basic');
assertEq(PediatricNeurolysisExt({}).function, 'PediatricNeurolysisExt', 'PediatricNeurolysisExt basic');
assertEq(PediatricMuscleBiopsySurgExt({}).function, 'PediatricMuscleBiopsySurgExt', 'PediatricMuscleBiopsySurgExt basic');
assertEq(PediatricSpinalCordDetetherExt({}).function, 'PediatricSpinalCordDetetherExt', 'PediatricSpinalCordDetetherExt basic');
assertEq(PediatricCRMOOrthoticExt({}).function, 'PediatricCRMOOrthoticExt', 'PediatricCRMOOrthoticExt basic');
console.log('pcc_pediatric_surg_ext63 unit: ' + passed + ' passed');