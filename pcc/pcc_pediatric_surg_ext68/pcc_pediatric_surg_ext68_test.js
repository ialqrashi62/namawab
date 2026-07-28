// Auto-generated test
"use strict";
const {PediatricShuntPlacementExt, PediatricETVSurgExt, PediatricSubgalealShuntExt, PediatricShuntRevisionExt, PediatricShuntRemovalExt, PediatricShuntExternalizationExt, PediatricShuntProgrammableExt, PediatricShuntAntibioticExt, PediatricDrainInsertionExt, PediatricThirdVentricleExplorationExt} = require('./pcc_pediatric_surg_ext68_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricShuntPlacementExt({}).function, 'PediatricShuntPlacementExt', 'PediatricShuntPlacementExt basic');
assertEq(PediatricETVSurgExt({}).function, 'PediatricETVSurgExt', 'PediatricETVSurgExt basic');
assertEq(PediatricSubgalealShuntExt({}).function, 'PediatricSubgalealShuntExt', 'PediatricSubgalealShuntExt basic');
assertEq(PediatricShuntRevisionExt({}).function, 'PediatricShuntRevisionExt', 'PediatricShuntRevisionExt basic');
assertEq(PediatricShuntRemovalExt({}).function, 'PediatricShuntRemovalExt', 'PediatricShuntRemovalExt basic');
assertEq(PediatricShuntExternalizationExt({}).function, 'PediatricShuntExternalizationExt', 'PediatricShuntExternalizationExt basic');
assertEq(PediatricShuntProgrammableExt({}).function, 'PediatricShuntProgrammableExt', 'PediatricShuntProgrammableExt basic');
assertEq(PediatricShuntAntibioticExt({}).function, 'PediatricShuntAntibioticExt', 'PediatricShuntAntibioticExt basic');
assertEq(PediatricDrainInsertionExt({}).function, 'PediatricDrainInsertionExt', 'PediatricDrainInsertionExt basic');
assertEq(PediatricThirdVentricleExplorationExt({}).function, 'PediatricThirdVentricleExplorationExt', 'PediatricThirdVentricleExplorationExt basic');
console.log('pcc_pediatric_surg_ext68 unit: ' + passed + ' passed');