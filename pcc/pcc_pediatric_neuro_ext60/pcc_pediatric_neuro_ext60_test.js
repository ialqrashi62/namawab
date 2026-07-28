// Auto-generated test
"use strict";
const {PediatricAutoimmuneEncephalitisExt, PediatricParaneoplasticExt, PediatricVasculitisExt, PediatricCNSLupusExt, PediatricNeuroBehcetExt, PediatricSarcoidNeuroExt, PediatricIgG4Ext, PediatricCLIPPERSExt, PediatricLymphomaCNSRelapseExt, PediatricGADAntibodyExt} = require('./pcc_pediatric_neuro_ext60_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricAutoimmuneEncephalitisExt({}).function, 'PediatricAutoimmuneEncephalitisExt', 'PediatricAutoimmuneEncephalitisExt basic');
assertEq(PediatricParaneoplasticExt({}).function, 'PediatricParaneoplasticExt', 'PediatricParaneoplasticExt basic');
assertEq(PediatricVasculitisExt({}).function, 'PediatricVasculitisExt', 'PediatricVasculitisExt basic');
assertEq(PediatricCNSLupusExt({}).function, 'PediatricCNSLupusExt', 'PediatricCNSLupusExt basic');
assertEq(PediatricNeuroBehcetExt({}).function, 'PediatricNeuroBehcetExt', 'PediatricNeuroBehcetExt basic');
assertEq(PediatricSarcoidNeuroExt({}).function, 'PediatricSarcoidNeuroExt', 'PediatricSarcoidNeuroExt basic');
assertEq(PediatricIgG4Ext({}).function, 'PediatricIgG4Ext', 'PediatricIgG4Ext basic');
assertEq(PediatricCLIPPERSExt({}).function, 'PediatricCLIPPERSExt', 'PediatricCLIPPERSExt basic');
assertEq(PediatricLymphomaCNSRelapseExt({}).function, 'PediatricLymphomaCNSRelapseExt', 'PediatricLymphomaCNSRelapseExt basic');
assertEq(PediatricGADAntibodyExt({}).function, 'PediatricGADAntibodyExt', 'PediatricGADAntibodyExt basic');
console.log('pcc_pediatric_neuro_ext60 unit: ' + passed + ' passed');