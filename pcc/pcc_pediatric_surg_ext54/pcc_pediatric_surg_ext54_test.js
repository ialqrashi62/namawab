// Auto-generated test
"use strict";
const {PediatricDBSPlacementExt, PediatricDBSProgrammingExt, PediatricLesioningSurgeryExt, PediatricPallidotomyExt, PediatricThalamotomyExt, PediatricITBRefillExt, PediatricITBPumpReplacementExt, PediatricVNSPlacementExt, PediatricRNSPlacementExt, PediatricNeuromodulationSurgeryExt} = require('./pcc_pediatric_surg_ext54_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricDBSPlacementExt({}).function, 'PediatricDBSPlacementExt', 'PediatricDBSPlacementExt basic');
assertEq(PediatricDBSProgrammingExt({}).function, 'PediatricDBSProgrammingExt', 'PediatricDBSProgrammingExt basic');
assertEq(PediatricLesioningSurgeryExt({}).function, 'PediatricLesioningSurgeryExt', 'PediatricLesioningSurgeryExt basic');
assertEq(PediatricPallidotomyExt({}).function, 'PediatricPallidotomyExt', 'PediatricPallidotomyExt basic');
assertEq(PediatricThalamotomyExt({}).function, 'PediatricThalamotomyExt', 'PediatricThalamotomyExt basic');
assertEq(PediatricITBRefillExt({}).function, 'PediatricITBRefillExt', 'PediatricITBRefillExt basic');
assertEq(PediatricITBPumpReplacementExt({}).function, 'PediatricITBPumpReplacementExt', 'PediatricITBPumpReplacementExt basic');
assertEq(PediatricVNSPlacementExt({}).function, 'PediatricVNSPlacementExt', 'PediatricVNSPlacementExt basic');
assertEq(PediatricRNSPlacementExt({}).function, 'PediatricRNSPlacementExt', 'PediatricRNSPlacementExt basic');
assertEq(PediatricNeuromodulationSurgeryExt({}).function, 'PediatricNeuromodulationSurgeryExt', 'PediatricNeuromodulationSurgeryExt basic');
console.log('pcc_pediatric_surg_ext54 unit: ' + passed + ' passed');