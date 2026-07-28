// Auto-generated test
"use strict";
const {EpilepsyClassificationExt, StatusEpilepticusExt, RefractoryEpilepsyExt, EpilepsySurgeryEvalExt, VagalNerveStimTuningExt, RNSProgrammingExt, DBSForEpilepsyExt, KetogenicDietExt, ASMLevelExt, EpilepsyGeneticsExt} = require('./pcc_neuro_ext68_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(EpilepsyClassificationExt({}).function, 'EpilepsyClassificationExt', 'EpilepsyClassificationExt basic');
assertEq(StatusEpilepticusExt({}).function, 'StatusEpilepticusExt', 'StatusEpilepticusExt basic');
assertEq(RefractoryEpilepsyExt({}).function, 'RefractoryEpilepsyExt', 'RefractoryEpilepsyExt basic');
assertEq(EpilepsySurgeryEvalExt({}).function, 'EpilepsySurgeryEvalExt', 'EpilepsySurgeryEvalExt basic');
assertEq(VagalNerveStimTuningExt({}).function, 'VagalNerveStimTuningExt', 'VagalNerveStimTuningExt basic');
assertEq(RNSProgrammingExt({}).function, 'RNSProgrammingExt', 'RNSProgrammingExt basic');
assertEq(DBSForEpilepsyExt({}).function, 'DBSForEpilepsyExt', 'DBSForEpilepsyExt basic');
assertEq(KetogenicDietExt({}).function, 'KetogenicDietExt', 'KetogenicDietExt basic');
assertEq(ASMLevelExt({}).function, 'ASMLevelExt', 'ASMLevelExt basic');
assertEq(EpilepsyGeneticsExt({}).function, 'EpilepsyGeneticsExt', 'EpilepsyGeneticsExt basic');
console.log('pcc_neuro_ext68 unit: ' + passed + ' passed');