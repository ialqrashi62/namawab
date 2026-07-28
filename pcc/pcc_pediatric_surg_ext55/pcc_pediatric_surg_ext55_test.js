// Auto-generated test
"use strict";
const {PediatricTumorResectionExt, PediatricAwakeCraniotomyExt, PediatricIntraoperativeMRIExt, PediatricLaserAblationExt, PediatricGliomaSurgeryExt, PediatricVPShuntTumorExt, PediatricCranioplastyExt, PediatricSpinalTumorSurgeryExt, PediatricEndoscopicResectionExt, PediatricBiopsySurgeryExt} = require('./pcc_pediatric_surg_ext55_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricTumorResectionExt({}).function, 'PediatricTumorResectionExt', 'PediatricTumorResectionExt basic');
assertEq(PediatricAwakeCraniotomyExt({}).function, 'PediatricAwakeCraniotomyExt', 'PediatricAwakeCraniotomyExt basic');
assertEq(PediatricIntraoperativeMRIExt({}).function, 'PediatricIntraoperativeMRIExt', 'PediatricIntraoperativeMRIExt basic');
assertEq(PediatricLaserAblationExt({}).function, 'PediatricLaserAblationExt', 'PediatricLaserAblationExt basic');
assertEq(PediatricGliomaSurgeryExt({}).function, 'PediatricGliomaSurgeryExt', 'PediatricGliomaSurgeryExt basic');
assertEq(PediatricVPShuntTumorExt({}).function, 'PediatricVPShuntTumorExt', 'PediatricVPShuntTumorExt basic');
assertEq(PediatricCranioplastyExt({}).function, 'PediatricCranioplastyExt', 'PediatricCranioplastyExt basic');
assertEq(PediatricSpinalTumorSurgeryExt({}).function, 'PediatricSpinalTumorSurgeryExt', 'PediatricSpinalTumorSurgeryExt basic');
assertEq(PediatricEndoscopicResectionExt({}).function, 'PediatricEndoscopicResectionExt', 'PediatricEndoscopicResectionExt basic');
assertEq(PediatricBiopsySurgeryExt({}).function, 'PediatricBiopsySurgeryExt', 'PediatricBiopsySurgeryExt basic');
console.log('pcc_pediatric_surg_ext55 unit: ' + passed + ' passed');