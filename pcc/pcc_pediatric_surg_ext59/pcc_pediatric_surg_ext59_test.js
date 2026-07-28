// Auto-generated test
"use strict";
const {PediatricThymectomyAutoimmuneExt, PediatricMSDiseaseModSurgeryExt, PediatricONSSurgeryExt, PediatricIntrathecalPumpExt, PediatricRehabDeviceExt, PediatricFunctionalElectricalStimExt, PediatricVRRehabExt, PediatricGaitTrainerSurgeryExt, PediatricPlasmaExchangeAccessExt, PediatricDMDImmunomodulatorExt} = require('./pcc_pediatric_surg_ext59_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricThymectomyAutoimmuneExt({}).function, 'PediatricThymectomyAutoimmuneExt', 'PediatricThymectomyAutoimmuneExt basic');
assertEq(PediatricMSDiseaseModSurgeryExt({}).function, 'PediatricMSDiseaseModSurgeryExt', 'PediatricMSDiseaseModSurgeryExt basic');
assertEq(PediatricONSSurgeryExt({}).function, 'PediatricONSSurgeryExt', 'PediatricONSSurgeryExt basic');
assertEq(PediatricIntrathecalPumpExt({}).function, 'PediatricIntrathecalPumpExt', 'PediatricIntrathecalPumpExt basic');
assertEq(PediatricRehabDeviceExt({}).function, 'PediatricRehabDeviceExt', 'PediatricRehabDeviceExt basic');
assertEq(PediatricFunctionalElectricalStimExt({}).function, 'PediatricFunctionalElectricalStimExt', 'PediatricFunctionalElectricalStimExt basic');
assertEq(PediatricVRRehabExt({}).function, 'PediatricVRRehabExt', 'PediatricVRRehabExt basic');
assertEq(PediatricGaitTrainerSurgeryExt({}).function, 'PediatricGaitTrainerSurgeryExt', 'PediatricGaitTrainerSurgeryExt basic');
assertEq(PediatricPlasmaExchangeAccessExt({}).function, 'PediatricPlasmaExchangeAccessExt', 'PediatricPlasmaExchangeAccessExt basic');
assertEq(PediatricDMDImmunomodulatorExt({}).function, 'PediatricDMDImmunomodulatorExt', 'PediatricDMDImmunomodulatorExt basic');
console.log('pcc_pediatric_surg_ext59 unit: ' + passed + ' passed');