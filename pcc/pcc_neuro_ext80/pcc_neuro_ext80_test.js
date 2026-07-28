// Auto-generated test
"use strict";
const {NMOExt, MOGDEMExt, ADEMSpectrumExt, MyelitisOpticaExt, MSVariantsExt, RadiologicallyIsolatedExt, ClinicallyIsolatedSynExt, MSTreatmentResponseExt, MSRelapseMgmtExt, MSMonitoringExt} = require('./pcc_neuro_ext80_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(NMOExt({}).function, 'NMOExt', 'NMOExt basic');
assertEq(MOGDEMExt({}).function, 'MOGDEMExt', 'MOGDEMExt basic');
assertEq(ADEMSpectrumExt({}).function, 'ADEMSpectrumExt', 'ADEMSpectrumExt basic');
assertEq(MyelitisOpticaExt({}).function, 'MyelitisOpticaExt', 'MyelitisOpticaExt basic');
assertEq(MSVariantsExt({}).function, 'MSVariantsExt', 'MSVariantsExt basic');
assertEq(RadiologicallyIsolatedExt({}).function, 'RadiologicallyIsolatedExt', 'RadiologicallyIsolatedExt basic');
assertEq(ClinicallyIsolatedSynExt({}).function, 'ClinicallyIsolatedSynExt', 'ClinicallyIsolatedSynExt basic');
assertEq(MSTreatmentResponseExt({}).function, 'MSTreatmentResponseExt', 'MSTreatmentResponseExt basic');
assertEq(MSRelapseMgmtExt({}).function, 'MSRelapseMgmtExt', 'MSRelapseMgmtExt basic');
assertEq(MSMonitoringExt({}).function, 'MSMonitoringExt', 'MSMonitoringExt basic');
console.log('pcc_neuro_ext80 unit: ' + passed + ' passed');