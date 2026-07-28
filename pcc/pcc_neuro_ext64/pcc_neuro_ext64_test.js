// Auto-generated test
"use strict";
const {IdiopathicIntracranialHypertensionExt3, VenousSinusStenosisStentingExt, CSFLeakSiteLocalizationExt, SpontaneousIntracranialHypotensionExt, ChiariMalformationComplexExt, SyringomyeliaMonitoringExt, BasilarInvaginationExt, CraniovertebralJunctionAnomalyExt, CSFFlowDynamicsExt, EmptySellaSyndromeMonitorExt} = require('./pcc_neuro_ext64_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(IdiopathicIntracranialHypertensionExt3({}).function, 'IdiopathicIntracranialHypertensionExt3', 'IdiopathicIntracranialHypertensionExt3 basic');
assertEq(VenousSinusStenosisStentingExt({}).function, 'VenousSinusStenosisStentingExt', 'VenousSinusStenosisStentingExt basic');
assertEq(CSFLeakSiteLocalizationExt({}).function, 'CSFLeakSiteLocalizationExt', 'CSFLeakSiteLocalizationExt basic');
assertEq(SpontaneousIntracranialHypotensionExt({}).function, 'SpontaneousIntracranialHypotensionExt', 'SpontaneousIntracranialHypotensionExt basic');
assertEq(ChiariMalformationComplexExt({}).function, 'ChiariMalformationComplexExt', 'ChiariMalformationComplexExt basic');
assertEq(SyringomyeliaMonitoringExt({}).function, 'SyringomyeliaMonitoringExt', 'SyringomyeliaMonitoringExt basic');
assertEq(BasilarInvaginationExt({}).function, 'BasilarInvaginationExt', 'BasilarInvaginationExt basic');
assertEq(CraniovertebralJunctionAnomalyExt({}).function, 'CraniovertebralJunctionAnomalyExt', 'CraniovertebralJunctionAnomalyExt basic');
assertEq(CSFFlowDynamicsExt({}).function, 'CSFFlowDynamicsExt', 'CSFFlowDynamicsExt basic');
assertEq(EmptySellaSyndromeMonitorExt({}).function, 'EmptySellaSyndromeMonitorExt', 'EmptySellaSyndromeMonitorExt basic');
console.log('pcc_neuro_ext64 unit: ' + passed + ' passed');