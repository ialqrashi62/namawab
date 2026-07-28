// Auto-generated test
"use strict";
const {PediatricVPShuntInfectionRevExt, PediatricEVDPlacementExt, PediatricCraniotomyForAbscessExt, PediatricSepticEmpyemaExt, PediatricSpinalDrainExt, PediatricLPForMeningitisExt, PediatricVPShuntExternalizationExt, PediatricVentriculitisTreatmentExt, PediatricSubduralEmpyemaExt, PediatricCNSInfectionRecoverSurgExt} = require('./pcc_pediatric_surg_ext61_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricVPShuntInfectionRevExt({}).function, 'PediatricVPShuntInfectionRevExt', 'PediatricVPShuntInfectionRevExt basic');
assertEq(PediatricEVDPlacementExt({}).function, 'PediatricEVDPlacementExt', 'PediatricEVDPlacementExt basic');
assertEq(PediatricCraniotomyForAbscessExt({}).function, 'PediatricCraniotomyForAbscessExt', 'PediatricCraniotomyForAbscessExt basic');
assertEq(PediatricSepticEmpyemaExt({}).function, 'PediatricSepticEmpyemaExt', 'PediatricSepticEmpyemaExt basic');
assertEq(PediatricSpinalDrainExt({}).function, 'PediatricSpinalDrainExt', 'PediatricSpinalDrainExt basic');
assertEq(PediatricLPForMeningitisExt({}).function, 'PediatricLPForMeningitisExt', 'PediatricLPForMeningitisExt basic');
assertEq(PediatricVPShuntExternalizationExt({}).function, 'PediatricVPShuntExternalizationExt', 'PediatricVPShuntExternalizationExt basic');
assertEq(PediatricVentriculitisTreatmentExt({}).function, 'PediatricVentriculitisTreatmentExt', 'PediatricVentriculitisTreatmentExt basic');
assertEq(PediatricSubduralEmpyemaExt({}).function, 'PediatricSubduralEmpyemaExt', 'PediatricSubduralEmpyemaExt basic');
assertEq(PediatricCNSInfectionRecoverSurgExt({}).function, 'PediatricCNSInfectionRecoverSurgExt', 'PediatricCNSInfectionRecoverSurgExt basic');
console.log('pcc_pediatric_surg_ext61 unit: ' + passed + ' passed');