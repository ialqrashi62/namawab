// Auto-generated test
"use strict";
const {PediatricSpinalFusionExt, PediatricGrowingRodExt, PediatricScoliosisSurgeryExt, PediatricMuscleBiopsyExt, PediatricTendonReleaseExt, PediatricGastrostomyExt, PediatricNissFundoplicationExt, PediatricTracheostomyExt, PediatricVPShuntExt, PediatricNusinersenDrugExt} = require('./pcc_pediatric_surg_ext66_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricSpinalFusionExt({}).function, 'PediatricSpinalFusionExt', 'PediatricSpinalFusionExt basic');
assertEq(PediatricGrowingRodExt({}).function, 'PediatricGrowingRodExt', 'PediatricGrowingRodExt basic');
assertEq(PediatricScoliosisSurgeryExt({}).function, 'PediatricScoliosisSurgeryExt', 'PediatricScoliosisSurgeryExt basic');
assertEq(PediatricMuscleBiopsyExt({}).function, 'PediatricMuscleBiopsyExt', 'PediatricMuscleBiopsyExt basic');
assertEq(PediatricTendonReleaseExt({}).function, 'PediatricTendonReleaseExt', 'PediatricTendonReleaseExt basic');
assertEq(PediatricGastrostomyExt({}).function, 'PediatricGastrostomyExt', 'PediatricGastrostomyExt basic');
assertEq(PediatricNissFundoplicationExt({}).function, 'PediatricNissFundoplicationExt', 'PediatricNissFundoplicationExt basic');
assertEq(PediatricTracheostomyExt({}).function, 'PediatricTracheostomyExt', 'PediatricTracheostomyExt basic');
assertEq(PediatricVPShuntExt({}).function, 'PediatricVPShuntExt', 'PediatricVPShuntExt basic');
assertEq(PediatricNusinersenDrugExt({}).function, 'PediatricNusinersenDrugExt', 'PediatricNusinersenDrugExt basic');
console.log('pcc_pediatric_surg_ext66 unit: ' + passed + ' passed');