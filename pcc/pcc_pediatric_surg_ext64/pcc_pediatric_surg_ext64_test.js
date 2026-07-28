// Auto-generated test
"use strict";
const {PediatricThymectomyExt, PediatricPlasmapheresisExt, PediatricIVIGExt, PediatricImmunoablativeTherapyExt, PediatricRituximabNMJExt, PediatricECulizumabExt, PediatricFcRNTreatmentExt, PediatricPlasmapheresisCathExt, PediatricNMJDietExt, PediatricSwallowingAssessExt} = require('./pcc_pediatric_surg_ext64_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricThymectomyExt({}).function, 'PediatricThymectomyExt', 'PediatricThymectomyExt basic');
assertEq(PediatricPlasmapheresisExt({}).function, 'PediatricPlasmapheresisExt', 'PediatricPlasmapheresisExt basic');
assertEq(PediatricIVIGExt({}).function, 'PediatricIVIGExt', 'PediatricIVIGExt basic');
assertEq(PediatricImmunoablativeTherapyExt({}).function, 'PediatricImmunoablativeTherapyExt', 'PediatricImmunoablativeTherapyExt basic');
assertEq(PediatricRituximabNMJExt({}).function, 'PediatricRituximabNMJExt', 'PediatricRituximabNMJExt basic');
assertEq(PediatricECulizumabExt({}).function, 'PediatricECulizumabExt', 'PediatricECulizumabExt basic');
assertEq(PediatricFcRNTreatmentExt({}).function, 'PediatricFcRNTreatmentExt', 'PediatricFcRNTreatmentExt basic');
assertEq(PediatricPlasmapheresisCathExt({}).function, 'PediatricPlasmapheresisCathExt', 'PediatricPlasmapheresisCathExt basic');
assertEq(PediatricNMJDietExt({}).function, 'PediatricNMJDietExt', 'PediatricNMJDietExt basic');
assertEq(PediatricSwallowingAssessExt({}).function, 'PediatricSwallowingAssessExt', 'PediatricSwallowingAssessExt basic');
console.log('pcc_pediatric_surg_ext64 unit: ' + passed + ' passed');