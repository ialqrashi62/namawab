// Auto-generated test
"use strict";
const {SleepDisorderExt, ObstructiveSleepApneaExt, CentralSleepApneaExt, NarcolepsyAssessmentExt, RestlessLegsExt, REMBehaviorDisorderExt, CircadianDisorderExt, CPAPTherapyExt, SleepStudyExt, SleepHygieneExt} = require('./pcc_neuro_ext85_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(SleepDisorderExt({}).function, 'SleepDisorderExt', 'SleepDisorderExt basic');
assertEq(ObstructiveSleepApneaExt({}).function, 'ObstructiveSleepApneaExt', 'ObstructiveSleepApneaExt basic');
assertEq(CentralSleepApneaExt({}).function, 'CentralSleepApneaExt', 'CentralSleepApneaExt basic');
assertEq(NarcolepsyAssessmentExt({}).function, 'NarcolepsyAssessmentExt', 'NarcolepsyAssessmentExt basic');
assertEq(RestlessLegsExt({}).function, 'RestlessLegsExt', 'RestlessLegsExt basic');
assertEq(REMBehaviorDisorderExt({}).function, 'REMBehaviorDisorderExt', 'REMBehaviorDisorderExt basic');
assertEq(CircadianDisorderExt({}).function, 'CircadianDisorderExt', 'CircadianDisorderExt basic');
assertEq(CPAPTherapyExt({}).function, 'CPAPTherapyExt', 'CPAPTherapyExt basic');
assertEq(SleepStudyExt({}).function, 'SleepStudyExt', 'SleepStudyExt basic');
assertEq(SleepHygieneExt({}).function, 'SleepHygieneExt', 'SleepHygieneExt basic');
console.log('pcc_neuro_ext85 unit: ' + passed + ' passed');