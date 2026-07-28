// Auto-generated test
"use strict";
const {PediatricPeripheralNeuropathyExt, PediatricCIDPExt, PediatricGuillainBarreExt, PediatricCIDPVariantExt, PediatricDiabeticNeuropathyExt, PediatricCMTExt, PediatricSmallFiberExt, PediatricAutonomicNeuropathyExt, PediatricHereditaryNeuropathyExt, PediatricVasculiticNeuropathyExt} = require('./pcc_pediatric_neuro_ext63_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricPeripheralNeuropathyExt({}).function, 'PediatricPeripheralNeuropathyExt', 'PediatricPeripheralNeuropathyExt basic');
assertEq(PediatricCIDPExt({}).function, 'PediatricCIDPExt', 'PediatricCIDPExt basic');
assertEq(PediatricGuillainBarreExt({}).function, 'PediatricGuillainBarreExt', 'PediatricGuillainBarreExt basic');
assertEq(PediatricCIDPVariantExt({}).function, 'PediatricCIDPVariantExt', 'PediatricCIDPVariantExt basic');
assertEq(PediatricDiabeticNeuropathyExt({}).function, 'PediatricDiabeticNeuropathyExt', 'PediatricDiabeticNeuropathyExt basic');
assertEq(PediatricCMTExt({}).function, 'PediatricCMTExt', 'PediatricCMTExt basic');
assertEq(PediatricSmallFiberExt({}).function, 'PediatricSmallFiberExt', 'PediatricSmallFiberExt basic');
assertEq(PediatricAutonomicNeuropathyExt({}).function, 'PediatricAutonomicNeuropathyExt', 'PediatricAutonomicNeuropathyExt basic');
assertEq(PediatricHereditaryNeuropathyExt({}).function, 'PediatricHereditaryNeuropathyExt', 'PediatricHereditaryNeuropathyExt basic');
assertEq(PediatricVasculiticNeuropathyExt({}).function, 'PediatricVasculiticNeuropathyExt', 'PediatricVasculiticNeuropathyExt basic');
console.log('pcc_pediatric_neuro_ext63 unit: ' + passed + ' passed');