// Auto-generated test
"use strict";
const {PediatricToneMgmtExt, PediatricIntrathecalPumpExt, PediatricSDRExt, PediatricBotulinumSurgExt, PediatricConstraintTherapyExt, PediatricGaitTrainingExt, PediatricPROExt, PediatricOrthoticCastingExt, PediatricOrthoScoliosisMgmtExt, PediatricOrthosisGaitExt} = require('./pcc_pediatric_surg_ext67_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricToneMgmtExt({}).function, 'PediatricToneMgmtExt', 'PediatricToneMgmtExt basic');
assertEq(PediatricIntrathecalPumpExt({}).function, 'PediatricIntrathecalPumpExt', 'PediatricIntrathecalPumpExt basic');
assertEq(PediatricSDRExt({}).function, 'PediatricSDRExt', 'PediatricSDRExt basic');
assertEq(PediatricBotulinumSurgExt({}).function, 'PediatricBotulinumSurgExt', 'PediatricBotulinumSurgExt basic');
assertEq(PediatricConstraintTherapyExt({}).function, 'PediatricConstraintTherapyExt', 'PediatricConstraintTherapyExt basic');
assertEq(PediatricGaitTrainingExt({}).function, 'PediatricGaitTrainingExt', 'PediatricGaitTrainingExt basic');
assertEq(PediatricPROExt({}).function, 'PediatricPROExt', 'PediatricPROExt basic');
assertEq(PediatricOrthoticCastingExt({}).function, 'PediatricOrthoticCastingExt', 'PediatricOrthoticCastingExt basic');
assertEq(PediatricOrthoScoliosisMgmtExt({}).function, 'PediatricOrthoScoliosisMgmtExt', 'PediatricOrthoScoliosisMgmtExt basic');
assertEq(PediatricOrthosisGaitExt({}).function, 'PediatricOrthosisGaitExt', 'PediatricOrthosisGaitExt basic');
console.log('pcc_pediatric_surg_ext67 unit: ' + passed + ' passed');