// Auto-generated test
"use strict";
const {PediatricMSExt, PediatricMSRelapseExt, PediatricMSProgressionExt, PediatricDMTManagementExt, PediatricNMOSDExt, PediatricMOGAntibodyExt, PediatricADEMExt, PediatricOpticNeuritisExt, PediatricTransverseMyelitisExt, PediatricMSRehabExt} = require('./pcc_pediatric_neuro_ext59_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricMSExt({}).function, 'PediatricMSExt', 'PediatricMSExt basic');
assertEq(PediatricMSRelapseExt({}).function, 'PediatricMSRelapseExt', 'PediatricMSRelapseExt basic');
assertEq(PediatricMSProgressionExt({}).function, 'PediatricMSProgressionExt', 'PediatricMSProgressionExt basic');
assertEq(PediatricDMTManagementExt({}).function, 'PediatricDMTManagementExt', 'PediatricDMTManagementExt basic');
assertEq(PediatricNMOSDExt({}).function, 'PediatricNMOSDExt', 'PediatricNMOSDExt basic');
assertEq(PediatricMOGAntibodyExt({}).function, 'PediatricMOGAntibodyExt', 'PediatricMOGAntibodyExt basic');
assertEq(PediatricADEMExt({}).function, 'PediatricADEMExt', 'PediatricADEMExt basic');
assertEq(PediatricOpticNeuritisExt({}).function, 'PediatricOpticNeuritisExt', 'PediatricOpticNeuritisExt basic');
assertEq(PediatricTransverseMyelitisExt({}).function, 'PediatricTransverseMyelitisExt', 'PediatricTransverseMyelitisExt basic');
assertEq(PediatricMSRehabExt({}).function, 'PediatricMSRehabExt', 'PediatricMSRehabExt basic');
console.log('pcc_pediatric_neuro_ext59 unit: ' + passed + ' passed');