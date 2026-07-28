// Auto-generated test
"use strict";
const {PediatricDBSPlaceGpiExt, PediatricDBSPlaceSTNExt, PediatricIntrathecalBaclofenSurgExt, PediatricIntrathecalBaclofenTestExt, PediatricITBPumpRevisionExt, PediatricITBPumpReplacementExt, PediatricDBSRechargeExt, PediatricDBSLeadReplaceExt, PediatricApomorphinePumpExt, PediatricDUODENALevodopaExt} = require('./pcc_pediatric_surg_ext70_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricDBSPlaceGpiExt({}).function, 'PediatricDBSPlaceGpiExt', 'PediatricDBSPlaceGpiExt basic');
assertEq(PediatricDBSPlaceSTNExt({}).function, 'PediatricDBSPlaceSTNExt', 'PediatricDBSPlaceSTNExt basic');
assertEq(PediatricIntrathecalBaclofenSurgExt({}).function, 'PediatricIntrathecalBaclofenSurgExt', 'PediatricIntrathecalBaclofenSurgExt basic');
assertEq(PediatricIntrathecalBaclofenTestExt({}).function, 'PediatricIntrathecalBaclofenTestExt', 'PediatricIntrathecalBaclofenTestExt basic');
assertEq(PediatricITBPumpRevisionExt({}).function, 'PediatricITBPumpRevisionExt', 'PediatricITBPumpRevisionExt basic');
assertEq(PediatricITBPumpReplacementExt({}).function, 'PediatricITBPumpReplacementExt', 'PediatricITBPumpReplacementExt basic');
assertEq(PediatricDBSRechargeExt({}).function, 'PediatricDBSRechargeExt', 'PediatricDBSRechargeExt basic');
assertEq(PediatricDBSLeadReplaceExt({}).function, 'PediatricDBSLeadReplaceExt', 'PediatricDBSLeadReplaceExt basic');
assertEq(PediatricApomorphinePumpExt({}).function, 'PediatricApomorphinePumpExt', 'PediatricApomorphinePumpExt basic');
assertEq(PediatricDUODENALevodopaExt({}).function, 'PediatricDUODENALevodopaExt', 'PediatricDUODENALevodopaExt basic');
console.log('pcc_pediatric_surg_ext70 unit: ' + passed + ' passed');