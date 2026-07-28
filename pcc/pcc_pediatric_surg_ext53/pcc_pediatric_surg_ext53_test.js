// Auto-generated test
"use strict";
const {PediatricVenousSinusStentSurgeryExt, PediatricVPShuntTapTestExt, PediatricChiariDecompressionExt, PediatricSyrinxShuntExt, PediatricBasilarInvaginationSurgeryExt, PediatricOccipitalCervicalFusionExt, PediatricVPShuntPlacementExt, PediatricEndoscopicThirdVentriculostomyExt, PediatricCSFDiversionExt, PediatricEndoscopicFenestrationExt} = require('./pcc_pediatric_surg_ext53_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricVenousSinusStentSurgeryExt({}).function, 'PediatricVenousSinusStentSurgeryExt', 'PediatricVenousSinusStentSurgeryExt basic');
assertEq(PediatricVPShuntTapTestExt({}).function, 'PediatricVPShuntTapTestExt', 'PediatricVPShuntTapTestExt basic');
assertEq(PediatricChiariDecompressionExt({}).function, 'PediatricChiariDecompressionExt', 'PediatricChiariDecompressionExt basic');
assertEq(PediatricSyrinxShuntExt({}).function, 'PediatricSyrinxShuntExt', 'PediatricSyrinxShuntExt basic');
assertEq(PediatricBasilarInvaginationSurgeryExt({}).function, 'PediatricBasilarInvaginationSurgeryExt', 'PediatricBasilarInvaginationSurgeryExt basic');
assertEq(PediatricOccipitalCervicalFusionExt({}).function, 'PediatricOccipitalCervicalFusionExt', 'PediatricOccipitalCervicalFusionExt basic');
assertEq(PediatricVPShuntPlacementExt({}).function, 'PediatricVPShuntPlacementExt', 'PediatricVPShuntPlacementExt basic');
assertEq(PediatricEndoscopicThirdVentriculostomyExt({}).function, 'PediatricEndoscopicThirdVentriculostomyExt', 'PediatricEndoscopicThirdVentriculostomyExt basic');
assertEq(PediatricCSFDiversionExt({}).function, 'PediatricCSFDiversionExt', 'PediatricCSFDiversionExt basic');
assertEq(PediatricEndoscopicFenestrationExt({}).function, 'PediatricEndoscopicFenestrationExt', 'PediatricEndoscopicFenestrationExt basic');
console.log('pcc_pediatric_surg_ext53 unit: ' + passed + ' passed');