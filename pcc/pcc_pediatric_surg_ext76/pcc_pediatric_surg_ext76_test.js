// Auto-generated test
"use strict";
const {PediatricWadaTestExt, PediatricMEGSourceImagingExt, PediatricFunctionalMRSurgeryExt, PediatricLanguageMappingSurgExt, PediatricMemoryMappingExt, PediatricAwakeCraniotomyExt, PediatricEpilepsySurgeryEvalExt, PediatricSurgicalResectionCognExt, PediatricCogRehabPostExt, PediatricCognitiveScreeningExt} = require('./pcc_pediatric_surg_ext76_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricWadaTestExt({}).function, 'PediatricWadaTestExt', 'PediatricWadaTestExt basic');
assertEq(PediatricMEGSourceImagingExt({}).function, 'PediatricMEGSourceImagingExt', 'PediatricMEGSourceImagingExt basic');
assertEq(PediatricFunctionalMRSurgeryExt({}).function, 'PediatricFunctionalMRSurgeryExt', 'PediatricFunctionalMRSurgeryExt basic');
assertEq(PediatricLanguageMappingSurgExt({}).function, 'PediatricLanguageMappingSurgExt', 'PediatricLanguageMappingSurgExt basic');
assertEq(PediatricMemoryMappingExt({}).function, 'PediatricMemoryMappingExt', 'PediatricMemoryMappingExt basic');
assertEq(PediatricAwakeCraniotomyExt({}).function, 'PediatricAwakeCraniotomyExt', 'PediatricAwakeCraniotomyExt basic');
assertEq(PediatricEpilepsySurgeryEvalExt({}).function, 'PediatricEpilepsySurgeryEvalExt', 'PediatricEpilepsySurgeryEvalExt basic');
assertEq(PediatricSurgicalResectionCognExt({}).function, 'PediatricSurgicalResectionCognExt', 'PediatricSurgicalResectionCognExt basic');
assertEq(PediatricCogRehabPostExt({}).function, 'PediatricCogRehabPostExt', 'PediatricCogRehabPostExt basic');
assertEq(PediatricCognitiveScreeningExt({}).function, 'PediatricCognitiveScreeningExt', 'PediatricCognitiveScreeningExt basic');
console.log('pcc_pediatric_surg_ext76 unit: ' + passed + ' passed');