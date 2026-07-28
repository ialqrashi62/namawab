// Auto-generated test
"use strict";
const {ParkinsonDiseaseExt, PDLevodopaResponseExt, PDMedicationExt, PDDBSProgrammingExt, PDDBSBatteryExt, PDSubthalamicDBSExt, PDGpiDBSExt, PDVimDBSETCenterExt, PDLevodopaCarbidopaInfusionExt, PDApomorphineInfusionExt} = require('./pcc_neuro_ext81_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(ParkinsonDiseaseExt({}).function, 'ParkinsonDiseaseExt', 'ParkinsonDiseaseExt basic');
assertEq(PDLevodopaResponseExt({}).function, 'PDLevodopaResponseExt', 'PDLevodopaResponseExt basic');
assertEq(PDMedicationExt({}).function, 'PDMedicationExt', 'PDMedicationExt basic');
assertEq(PDDBSProgrammingExt({}).function, 'PDDBSProgrammingExt', 'PDDBSProgrammingExt basic');
assertEq(PDDBSBatteryExt({}).function, 'PDDBSBatteryExt', 'PDDBSBatteryExt basic');
assertEq(PDSubthalamicDBSExt({}).function, 'PDSubthalamicDBSExt', 'PDSubthalamicDBSExt basic');
assertEq(PDGpiDBSExt({}).function, 'PDGpiDBSExt', 'PDGpiDBSExt basic');
assertEq(PDVimDBSETCenterExt({}).function, 'PDVimDBSETCenterExt', 'PDVimDBSETCenterExt basic');
assertEq(PDLevodopaCarbidopaInfusionExt({}).function, 'PDLevodopaCarbidopaInfusionExt', 'PDLevodopaCarbidopaInfusionExt basic');
assertEq(PDApomorphineInfusionExt({}).function, 'PDApomorphineInfusionExt', 'PDApomorphineInfusionExt basic');
console.log('pcc_neuro_ext81 unit: ' + passed + ' passed');