// Auto-generated test
"use strict";
const {PediatricIIHFollowupExt, PediatricVenousSinusStentExt, PediatricCSFLeakMonitorExt, PediatricIntracranialHypotensionExt, PediatricChiariAssessmentExt, PediatricSyringomyeliaFollowExt, PediatricBasilarInvaginationExt, PediatricCVJAnomalyExt, PediatricCSFFlowDynamicsExt, PediatricEmptySellaMonitorExt} = require('./pcc_pediatric_neuro_ext53_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricIIHFollowupExt({}).function, 'PediatricIIHFollowupExt', 'PediatricIIHFollowupExt basic');
assertEq(PediatricVenousSinusStentExt({}).function, 'PediatricVenousSinusStentExt', 'PediatricVenousSinusStentExt basic');
assertEq(PediatricCSFLeakMonitorExt({}).function, 'PediatricCSFLeakMonitorExt', 'PediatricCSFLeakMonitorExt basic');
assertEq(PediatricIntracranialHypotensionExt({}).function, 'PediatricIntracranialHypotensionExt', 'PediatricIntracranialHypotensionExt basic');
assertEq(PediatricChiariAssessmentExt({}).function, 'PediatricChiariAssessmentExt', 'PediatricChiariAssessmentExt basic');
assertEq(PediatricSyringomyeliaFollowExt({}).function, 'PediatricSyringomyeliaFollowExt', 'PediatricSyringomyeliaFollowExt basic');
assertEq(PediatricBasilarInvaginationExt({}).function, 'PediatricBasilarInvaginationExt', 'PediatricBasilarInvaginationExt basic');
assertEq(PediatricCVJAnomalyExt({}).function, 'PediatricCVJAnomalyExt', 'PediatricCVJAnomalyExt basic');
assertEq(PediatricCSFFlowDynamicsExt({}).function, 'PediatricCSFFlowDynamicsExt', 'PediatricCSFFlowDynamicsExt basic');
assertEq(PediatricEmptySellaMonitorExt({}).function, 'PediatricEmptySellaMonitorExt', 'PediatricEmptySellaMonitorExt basic');
console.log('pcc_pediatric_neuro_ext53 unit: ' + passed + ' passed');