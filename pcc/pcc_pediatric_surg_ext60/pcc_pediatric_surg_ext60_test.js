// Auto-generated test
"use strict";
const {PediatricAEImmunotherapySurgExt, PediatricRituximabSurgExt, PediatricCyclophosphamideExt, PediatricPlasmaExchangeSurgExt, PediatricIVIGAdminExt, PediatricSteroidPulseSurgExt, PediatricImmunosuppressantExt, PediatricBiologicInfusionExt, PediatricTocilizumabExt, PediatricBortezomibExt} = require('./pcc_pediatric_surg_ext60_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricAEImmunotherapySurgExt({}).function, 'PediatricAEImmunotherapySurgExt', 'PediatricAEImmunotherapySurgExt basic');
assertEq(PediatricRituximabSurgExt({}).function, 'PediatricRituximabSurgExt', 'PediatricRituximabSurgExt basic');
assertEq(PediatricCyclophosphamideExt({}).function, 'PediatricCyclophosphamideExt', 'PediatricCyclophosphamideExt basic');
assertEq(PediatricPlasmaExchangeSurgExt({}).function, 'PediatricPlasmaExchangeSurgExt', 'PediatricPlasmaExchangeSurgExt basic');
assertEq(PediatricIVIGAdminExt({}).function, 'PediatricIVIGAdminExt', 'PediatricIVIGAdminExt basic');
assertEq(PediatricSteroidPulseSurgExt({}).function, 'PediatricSteroidPulseSurgExt', 'PediatricSteroidPulseSurgExt basic');
assertEq(PediatricImmunosuppressantExt({}).function, 'PediatricImmunosuppressantExt', 'PediatricImmunosuppressantExt basic');
assertEq(PediatricBiologicInfusionExt({}).function, 'PediatricBiologicInfusionExt', 'PediatricBiologicInfusionExt basic');
assertEq(PediatricTocilizumabExt({}).function, 'PediatricTocilizumabExt', 'PediatricTocilizumabExt basic');
assertEq(PediatricBortezomibExt({}).function, 'PediatricBortezomibExt', 'PediatricBortezomibExt basic');
console.log('pcc_pediatric_surg_ext60 unit: ' + passed + ' passed');