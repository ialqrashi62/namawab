// Auto-generated test
"use strict";
const {SialorrheaManagementExt, SpasticityOralExt, DysarthriaAssessmentExt, DysphagiaScreeningExt, PEGPlacementExt, TracheostomyDecannulationExt, RespiratoryAssessmentExt, VentManagementExt, SleepApneaStrokeExt, GIAssessmentNeuroExt} = require('./pcc_neuro_ext86_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(SialorrheaManagementExt({}).function, 'SialorrheaManagementExt', 'SialorrheaManagementExt basic');
assertEq(SpasticityOralExt({}).function, 'SpasticityOralExt', 'SpasticityOralExt basic');
assertEq(DysarthriaAssessmentExt({}).function, 'DysarthriaAssessmentExt', 'DysarthriaAssessmentExt basic');
assertEq(DysphagiaScreeningExt({}).function, 'DysphagiaScreeningExt', 'DysphagiaScreeningExt basic');
assertEq(PEGPlacementExt({}).function, 'PEGPlacementExt', 'PEGPlacementExt basic');
assertEq(TracheostomyDecannulationExt({}).function, 'TracheostomyDecannulationExt', 'TracheostomyDecannulationExt basic');
assertEq(RespiratoryAssessmentExt({}).function, 'RespiratoryAssessmentExt', 'RespiratoryAssessmentExt basic');
assertEq(VentManagementExt({}).function, 'VentManagementExt', 'VentManagementExt basic');
assertEq(SleepApneaStrokeExt({}).function, 'SleepApneaStrokeExt', 'SleepApneaStrokeExt basic');
assertEq(GIAssessmentNeuroExt({}).function, 'GIAssessmentNeuroExt', 'GIAssessmentNeuroExt basic');
console.log('pcc_neuro_ext86 unit: ' + passed + ' passed');