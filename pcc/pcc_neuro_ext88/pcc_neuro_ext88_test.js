// Auto-generated test
"use strict";
const {MedicalRefractoryEpilepsyExt, SurgicalEpilepsyEvalExt, LaserAblationExt, RNSExt, DBSForEpilepsyExt, VagusNerveTuneExt, KetogenicDietNeuroExt, ACTHExt, EpilepsyGeneticExt, SuddenUnexpectedDeathEpilepsyRiskExt} = require('./pcc_neuro_ext88_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(MedicalRefractoryEpilepsyExt({}).function, 'MedicalRefractoryEpilepsyExt', 'MedicalRefractoryEpilepsyExt basic');
assertEq(SurgicalEpilepsyEvalExt({}).function, 'SurgicalEpilepsyEvalExt', 'SurgicalEpilepsyEvalExt basic');
assertEq(LaserAblationExt({}).function, 'LaserAblationExt', 'LaserAblationExt basic');
assertEq(RNSExt({}).function, 'RNSExt', 'RNSExt basic');
assertEq(DBSForEpilepsyExt({}).function, 'DBSForEpilepsyExt', 'DBSForEpilepsyExt basic');
assertEq(VagusNerveTuneExt({}).function, 'VagusNerveTuneExt', 'VagusNerveTuneExt basic');
assertEq(KetogenicDietNeuroExt({}).function, 'KetogenicDietNeuroExt', 'KetogenicDietNeuroExt basic');
assertEq(ACTHExt({}).function, 'ACTHExt', 'ACTHExt basic');
assertEq(EpilepsyGeneticExt({}).function, 'EpilepsyGeneticExt', 'EpilepsyGeneticExt basic');
assertEq(SuddenUnexpectedDeathEpilepsyRiskExt({}).function, 'SuddenUnexpectedDeathEpilepsyRiskExt', 'SuddenUnexpectedDeathEpilepsyRiskExt basic');
console.log('pcc_neuro_ext88 unit: ' + passed + ' passed');