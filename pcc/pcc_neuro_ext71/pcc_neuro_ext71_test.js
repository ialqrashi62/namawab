// Auto-generated test
"use strict";
const {AutoimmuneEncephalitisExt, ParaneoplasticSyndromeExt, CerebralVasculitisExt, CNSLupusExt, NeuroBehcetExt, SarcoidNeuroExt, NeuroIgG4Ext, CLIPPERSOrNeuroBehcetExt, LymphomaCNSRelapseExt, GADAntibodyExt} = require('./pcc_neuro_ext71_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(AutoimmuneEncephalitisExt({}).function, 'AutoimmuneEncephalitisExt', 'AutoimmuneEncephalitisExt basic');
assertEq(ParaneoplasticSyndromeExt({}).function, 'ParaneoplasticSyndromeExt', 'ParaneoplasticSyndromeExt basic');
assertEq(CerebralVasculitisExt({}).function, 'CerebralVasculitisExt', 'CerebralVasculitisExt basic');
assertEq(CNSLupusExt({}).function, 'CNSLupusExt', 'CNSLupusExt basic');
assertEq(NeuroBehcetExt({}).function, 'NeuroBehcetExt', 'NeuroBehcetExt basic');
assertEq(SarcoidNeuroExt({}).function, 'SarcoidNeuroExt', 'SarcoidNeuroExt basic');
assertEq(NeuroIgG4Ext({}).function, 'NeuroIgG4Ext', 'NeuroIgG4Ext basic');
assertEq(CLIPPERSOrNeuroBehcetExt({}).function, 'CLIPPERSOrNeuroBehcetExt', 'CLIPPERSOrNeuroBehcetExt basic');
assertEq(LymphomaCNSRelapseExt({}).function, 'LymphomaCNSRelapseExt', 'LymphomaCNSRelapseExt basic');
assertEq(GADAntibodyExt({}).function, 'GADAntibodyExt', 'GADAntibodyExt basic');
console.log('pcc_neuro_ext71 unit: ' + passed + ' passed');