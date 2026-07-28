// Auto-generated test
"use strict";
const {PediatricEpilepsySurgeryExt, PediatricHemispherotomyExt, PediatricCorpusCallosotomyExt, PediatricLesionectomyExt, PediatricLaserAblationEpilepsyExt, PediatricSurgicalResectionExt, PediatricSEEGPlacementExt, PediatricPhase2MonitoringExt, PediatricGridPlacementExt, PediatricResectiveEpilepsySurgeryExt} = require('./pcc_pediatric_surg_ext57_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricEpilepsySurgeryExt({}).function, 'PediatricEpilepsySurgeryExt', 'PediatricEpilepsySurgeryExt basic');
assertEq(PediatricHemispherotomyExt({}).function, 'PediatricHemispherotomyExt', 'PediatricHemispherotomyExt basic');
assertEq(PediatricCorpusCallosotomyExt({}).function, 'PediatricCorpusCallosotomyExt', 'PediatricCorpusCallosotomyExt basic');
assertEq(PediatricLesionectomyExt({}).function, 'PediatricLesionectomyExt', 'PediatricLesionectomyExt basic');
assertEq(PediatricLaserAblationEpilepsyExt({}).function, 'PediatricLaserAblationEpilepsyExt', 'PediatricLaserAblationEpilepsyExt basic');
assertEq(PediatricSurgicalResectionExt({}).function, 'PediatricSurgicalResectionExt', 'PediatricSurgicalResectionExt basic');
assertEq(PediatricSEEGPlacementExt({}).function, 'PediatricSEEGPlacementExt', 'PediatricSEEGPlacementExt basic');
assertEq(PediatricPhase2MonitoringExt({}).function, 'PediatricPhase2MonitoringExt', 'PediatricPhase2MonitoringExt basic');
assertEq(PediatricGridPlacementExt({}).function, 'PediatricGridPlacementExt', 'PediatricGridPlacementExt basic');
assertEq(PediatricResectiveEpilepsySurgeryExt({}).function, 'PediatricResectiveEpilepsySurgeryExt', 'PediatricResectiveEpilepsySurgeryExt basic');
console.log('pcc_pediatric_surg_ext57 unit: ' + passed + ' passed');