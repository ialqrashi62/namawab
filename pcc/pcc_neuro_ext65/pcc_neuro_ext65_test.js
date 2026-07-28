// Auto-generated test
"use strict";
const {NeurodegenerativeDiseaseExt, MovementDisorderAssessmentExt, DystoniaClassificationExt, AtaxiaDiagnosticExt, ChoreaDisorderExt, TremorPhenotypeExt, TicDisorderAssessmentExt, MyoclonusClassificationExt, ParkinsonismAtypicalExt, NeuroacanthocytosisExt} = require('./pcc_neuro_ext65_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(NeurodegenerativeDiseaseExt({}).function, 'NeurodegenerativeDiseaseExt', 'NeurodegenerativeDiseaseExt basic');
assertEq(MovementDisorderAssessmentExt({}).function, 'MovementDisorderAssessmentExt', 'MovementDisorderAssessmentExt basic');
assertEq(DystoniaClassificationExt({}).function, 'DystoniaClassificationExt', 'DystoniaClassificationExt basic');
assertEq(AtaxiaDiagnosticExt({}).function, 'AtaxiaDiagnosticExt', 'AtaxiaDiagnosticExt basic');
assertEq(ChoreaDisorderExt({}).function, 'ChoreaDisorderExt', 'ChoreaDisorderExt basic');
assertEq(TremorPhenotypeExt({}).function, 'TremorPhenotypeExt', 'TremorPhenotypeExt basic');
assertEq(TicDisorderAssessmentExt({}).function, 'TicDisorderAssessmentExt', 'TicDisorderAssessmentExt basic');
assertEq(MyoclonusClassificationExt({}).function, 'MyoclonusClassificationExt', 'MyoclonusClassificationExt basic');
assertEq(ParkinsonismAtypicalExt({}).function, 'ParkinsonismAtypicalExt', 'ParkinsonismAtypicalExt basic');
assertEq(NeuroacanthocytosisExt({}).function, 'NeuroacanthocytosisExt', 'NeuroacanthocytosisExt basic');
console.log('pcc_neuro_ext65 unit: ' + passed + ' passed');