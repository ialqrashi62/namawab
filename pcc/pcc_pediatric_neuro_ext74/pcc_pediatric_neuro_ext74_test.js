// Auto-generated test
"use strict";
const {PediatricSleepDisorderExt, PediatricOSAExt, PediatricCSAExt, PediatricNarcolepsyExt, PediatricRLSExt, PediatricRBDExt, PediatricCircadianExt, PediatricCPAPExt, PediatricAdenotonsillectomyExt, PediatricSleepApneaSynExt} = require('./pcc_pediatric_neuro_ext74_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricSleepDisorderExt({}).function, 'PediatricSleepDisorderExt', 'PediatricSleepDisorderExt basic');
assertEq(PediatricOSAExt({}).function, 'PediatricOSAExt', 'PediatricOSAExt basic');
assertEq(PediatricCSAExt({}).function, 'PediatricCSAExt', 'PediatricCSAExt basic');
assertEq(PediatricNarcolepsyExt({}).function, 'PediatricNarcolepsyExt', 'PediatricNarcolepsyExt basic');
assertEq(PediatricRLSExt({}).function, 'PediatricRLSExt', 'PediatricRLSExt basic');
assertEq(PediatricRBDExt({}).function, 'PediatricRBDExt', 'PediatricRBDExt basic');
assertEq(PediatricCircadianExt({}).function, 'PediatricCircadianExt', 'PediatricCircadianExt basic');
assertEq(PediatricCPAPExt({}).function, 'PediatricCPAPExt', 'PediatricCPAPExt basic');
assertEq(PediatricAdenotonsillectomyExt({}).function, 'PediatricAdenotonsillectomyExt', 'PediatricAdenotonsillectomyExt basic');
assertEq(PediatricSleepApneaSynExt({}).function, 'PediatricSleepApneaSynExt', 'PediatricSleepApneaSynExt basic');
console.log('pcc_pediatric_neuro_ext74 unit: ' + passed + ' passed');