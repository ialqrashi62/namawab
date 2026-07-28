// Auto-generated test
"use strict";
const {PediatricNMOExt, PediatricMOGDEMExt, PediatricADEMSpectrumExt, PediatricMyelitisOpticaExt, PediatricMSVariantsExt, PediatricRISExt, PediatricCISExt, PediatricMSTreatmentRespExt, PediatricMSRelapseMgmtExt, PediatricMSMonitoringExt} = require('./pcc_pediatric_neuro_ext69_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricNMOExt({}).function, 'PediatricNMOExt', 'PediatricNMOExt basic');
assertEq(PediatricMOGDEMExt({}).function, 'PediatricMOGDEMExt', 'PediatricMOGDEMExt basic');
assertEq(PediatricADEMSpectrumExt({}).function, 'PediatricADEMSpectrumExt', 'PediatricADEMSpectrumExt basic');
assertEq(PediatricMyelitisOpticaExt({}).function, 'PediatricMyelitisOpticaExt', 'PediatricMyelitisOpticaExt basic');
assertEq(PediatricMSVariantsExt({}).function, 'PediatricMSVariantsExt', 'PediatricMSVariantsExt basic');
assertEq(PediatricRISExt({}).function, 'PediatricRISExt', 'PediatricRISExt basic');
assertEq(PediatricCISExt({}).function, 'PediatricCISExt', 'PediatricCISExt basic');
assertEq(PediatricMSTreatmentRespExt({}).function, 'PediatricMSTreatmentRespExt', 'PediatricMSTreatmentRespExt basic');
assertEq(PediatricMSRelapseMgmtExt({}).function, 'PediatricMSRelapseMgmtExt', 'PediatricMSRelapseMgmtExt basic');
assertEq(PediatricMSMonitoringExt({}).function, 'PediatricMSMonitoringExt', 'PediatricMSMonitoringExt basic');
console.log('pcc_pediatric_neuro_ext69 unit: ' + passed + ' passed');