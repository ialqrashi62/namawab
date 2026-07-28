// Auto-generated test
"use strict";
const {PeripheralNeuropathyExt, CIDPExt, GuillainBarreExt, CIDPVariantExt, DiabeticNeuropathyExt, CharcotMarieToothExt, SmallFiberNeuropathyExt, AutonomicNeuropathyExt, HereditaryNeuropathyExt, VasculiticNeuropathyExt} = require('./pcc_neuro_ext74_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PeripheralNeuropathyExt({}).function, 'PeripheralNeuropathyExt', 'PeripheralNeuropathyExt basic');
assertEq(CIDPExt({}).function, 'CIDPExt', 'CIDPExt basic');
assertEq(GuillainBarreExt({}).function, 'GuillainBarreExt', 'GuillainBarreExt basic');
assertEq(CIDPVariantExt({}).function, 'CIDPVariantExt', 'CIDPVariantExt basic');
assertEq(DiabeticNeuropathyExt({}).function, 'DiabeticNeuropathyExt', 'DiabeticNeuropathyExt basic');
assertEq(CharcotMarieToothExt({}).function, 'CharcotMarieToothExt', 'CharcotMarieToothExt basic');
assertEq(SmallFiberNeuropathyExt({}).function, 'SmallFiberNeuropathyExt', 'SmallFiberNeuropathyExt basic');
assertEq(AutonomicNeuropathyExt({}).function, 'AutonomicNeuropathyExt', 'AutonomicNeuropathyExt basic');
assertEq(HereditaryNeuropathyExt({}).function, 'HereditaryNeuropathyExt', 'HereditaryNeuropathyExt basic');
assertEq(VasculiticNeuropathyExt({}).function, 'VasculiticNeuropathyExt', 'VasculiticNeuropathyExt basic');
console.log('pcc_neuro_ext74 unit: ' + passed + ' passed');