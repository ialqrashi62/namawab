// Auto-generated test
"use strict";
const {PediatricNeuroAtherosclerosisSurgeryExt, PediatricBypassProcedureExt, PediatricECICProcedureExt, PediatricMicrobleedsResectionExt, PediatricSiderosisCavityExt, PediatricRadiationNecrosisResectionExt, PediatricPCAOccipitalStimulatorExt, PediatricPPAVagusNerveStimExt, PediatricCBDPallidotomyExt, PediatricPSPDeepBrainStimExt} = require('./pcc_pediatric_surg_ext52_engine');
let passed=0;
function assertEq(a,b,msg){if(JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg);process.exit(1);}}
assertEq(PediatricNeuroAtherosclerosisSurgeryExt({}).function, 'PediatricNeuroAtherosclerosisSurgeryExt', 'PediatricNeuroAtherosclerosisSurgeryExt basic');
assertEq(PediatricBypassProcedureExt({}).function, 'PediatricBypassProcedureExt', 'PediatricBypassProcedureExt basic');
assertEq(PediatricECICProcedureExt({}).function, 'PediatricECICProcedureExt', 'PediatricECICProcedureExt basic');
assertEq(PediatricMicrobleedsResectionExt({}).function, 'PediatricMicrobleedsResectionExt', 'PediatricMicrobleedsResectionExt basic');
assertEq(PediatricSiderosisCavityExt({}).function, 'PediatricSiderosisCavityExt', 'PediatricSiderosisCavityExt basic');
assertEq(PediatricRadiationNecrosisResectionExt({}).function, 'PediatricRadiationNecrosisResectionExt', 'PediatricRadiationNecrosisResectionExt basic');
assertEq(PediatricPCAOccipitalStimulatorExt({}).function, 'PediatricPCAOccipitalStimulatorExt', 'PediatricPCAOccipitalStimulatorExt basic');
assertEq(PediatricPPAVagusNerveStimExt({}).function, 'PediatricPPAVagusNerveStimExt', 'PediatricPPAVagusNerveStimExt basic');
assertEq(PediatricCBDPallidotomyExt({}).function, 'PediatricCBDPallidotomyExt', 'PediatricCBDPallidotomyExt basic');
assertEq(PediatricPSPDeepBrainStimExt({}).function, 'PediatricPSPDeepBrainStimExt', 'PediatricPSPDeepBrainStimExt basic');
console.log('pcc_pediatric_surg_ext52 unit: ' + passed + ' passed');