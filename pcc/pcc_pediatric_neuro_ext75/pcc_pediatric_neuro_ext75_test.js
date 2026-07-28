// Auto-generated test
"use strict";
const {PediatricSialorrheaExt, PediatricSpasticityOralExt, PediatricDysarthriaExt, PediatricDysphagiaExt, PediatricPEGExt, PediatricTracheostomyDecannExt, PediatricRespAssessmentExt, PediatricVentMgmtExt, PediatricSleepApneaExt, PediatricGIAssessmentExt} = require('./pcc_pediatric_neuro_ext75_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricSialorrheaExt({}).function, 'PediatricSialorrheaExt', 'PediatricSialorrheaExt basic');
assertEq(PediatricSpasticityOralExt({}).function, 'PediatricSpasticityOralExt', 'PediatricSpasticityOralExt basic');
assertEq(PediatricDysarthriaExt({}).function, 'PediatricDysarthriaExt', 'PediatricDysarthriaExt basic');
assertEq(PediatricDysphagiaExt({}).function, 'PediatricDysphagiaExt', 'PediatricDysphagiaExt basic');
assertEq(PediatricPEGExt({}).function, 'PediatricPEGExt', 'PediatricPEGExt basic');
assertEq(PediatricTracheostomyDecannExt({}).function, 'PediatricTracheostomyDecannExt', 'PediatricTracheostomyDecannExt basic');
assertEq(PediatricRespAssessmentExt({}).function, 'PediatricRespAssessmentExt', 'PediatricRespAssessmentExt basic');
assertEq(PediatricVentMgmtExt({}).function, 'PediatricVentMgmtExt', 'PediatricVentMgmtExt basic');
assertEq(PediatricSleepApneaExt({}).function, 'PediatricSleepApneaExt', 'PediatricSleepApneaExt basic');
assertEq(PediatricGIAssessmentExt({}).function, 'PediatricGIAssessmentExt', 'PediatricGIAssessmentExt basic');
console.log('pcc_pediatric_neuro_ext75 unit: ' + passed + ' passed');