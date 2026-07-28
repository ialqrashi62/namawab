// Auto-generated test
"use strict";
const {PediatricIntracranialAtherosclerosisExt, PediatricCerebralMicrobleedsExt, PediatricSuperficialSiderosisExt, PediatricRadiationVasculopathyExt, PediatricPosteriorCorticalAtrophyExt, PediatricProgressiveAphasiaExt, PediatricCorticobasalDegenerationExt, PediatricProgressiveSupranuclearPalsyExt, PediatricMultipleSystemAtrophyExt, PediatricLewyBodyDementiaExt} = require('./pcc_pediatric_neuro_ext52_engine');
let passed=0;
function assertEq(a,b,msg){if(JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg);process.exit(1);}}
assertEq(PediatricIntracranialAtherosclerosisExt({}).function, 'PediatricIntracranialAtherosclerosisExt', 'PediatricIntracranialAtherosclerosisExt basic');
assertEq(PediatricCerebralMicrobleedsExt({}).function, 'PediatricCerebralMicrobleedsExt', 'PediatricCerebralMicrobleedsExt basic');
assertEq(PediatricSuperficialSiderosisExt({}).function, 'PediatricSuperficialSiderosisExt', 'PediatricSuperficialSiderosisExt basic');
assertEq(PediatricRadiationVasculopathyExt({}).function, 'PediatricRadiationVasculopathyExt', 'PediatricRadiationVasculopathyExt basic');
assertEq(PediatricPosteriorCorticalAtrophyExt({}).function, 'PediatricPosteriorCorticalAtrophyExt', 'PediatricPosteriorCorticalAtrophyExt basic');
assertEq(PediatricProgressiveAphasiaExt({}).function, 'PediatricProgressiveAphasiaExt', 'PediatricProgressiveAphasiaExt basic');
assertEq(PediatricCorticobasalDegenerationExt({}).function, 'PediatricCorticobasalDegenerationExt', 'PediatricCorticobasalDegenerationExt basic');
assertEq(PediatricProgressiveSupranuclearPalsyExt({}).function, 'PediatricProgressiveSupranuclearPalsyExt', 'PediatricProgressiveSupranuclearPalsyExt basic');
assertEq(PediatricMultipleSystemAtrophyExt({}).function, 'PediatricMultipleSystemAtrophyExt', 'PediatricMultipleSystemAtrophyExt basic');
assertEq(PediatricLewyBodyDementiaExt({}).function, 'PediatricLewyBodyDementiaExt', 'PediatricLewyBodyDementiaExt basic');
console.log('pcc_pediatric_neuro_ext52 unit: ' + passed + ' passed');