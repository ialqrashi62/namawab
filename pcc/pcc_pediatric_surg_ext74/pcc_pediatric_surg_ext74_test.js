// Auto-generated test
"use strict";
const {PediatricTonsillectomyExt, PediatricAdenoidectomyExt, PediatricUvulopalatoplastyExt, PediatricCPAPInitExt, PediatricBiPAPInitExt, PediatricCPAPFollowExt, PediatricCranialRemodelingExt, PediatricPharyngoplastyExt, PediatricMaxillaryMandibularExt, PediatricTracheostomyExt} = require('./pcc_pediatric_surg_ext74_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricTonsillectomyExt({}).function, 'PediatricTonsillectomyExt', 'PediatricTonsillectomyExt basic');
assertEq(PediatricAdenoidectomyExt({}).function, 'PediatricAdenoidectomyExt', 'PediatricAdenoidectomyExt basic');
assertEq(PediatricUvulopalatoplastyExt({}).function, 'PediatricUvulopalatoplastyExt', 'PediatricUvulopalatoplastyExt basic');
assertEq(PediatricCPAPInitExt({}).function, 'PediatricCPAPInitExt', 'PediatricCPAPInitExt basic');
assertEq(PediatricBiPAPInitExt({}).function, 'PediatricBiPAPInitExt', 'PediatricBiPAPInitExt basic');
assertEq(PediatricCPAPFollowExt({}).function, 'PediatricCPAPFollowExt', 'PediatricCPAPFollowExt basic');
assertEq(PediatricCranialRemodelingExt({}).function, 'PediatricCranialRemodelingExt', 'PediatricCranialRemodelingExt basic');
assertEq(PediatricPharyngoplastyExt({}).function, 'PediatricPharyngoplastyExt', 'PediatricPharyngoplastyExt basic');
assertEq(PediatricMaxillaryMandibularExt({}).function, 'PediatricMaxillaryMandibularExt', 'PediatricMaxillaryMandibularExt basic');
assertEq(PediatricTracheostomyExt({}).function, 'PediatricTracheostomyExt', 'PediatricTracheostomyExt basic');
console.log('pcc_pediatric_surg_ext74 unit: ' + passed + ' passed');