// Auto-generated test
"use strict";
const {PediatricBrainTumorStagingExt, PediatricGliomaMolecularExt, PediatricMedulloblastomaExt, PediatricEpendymomaExt, PediatricATRTClassificationExt, PediatricDNETExt, PediatricCraniopharyngiomaExt, PediatricPinealtumorExt, PediatricBrainstemGliomaExt, PediatricNeuroOncFollowupExt} = require('./pcc_pediatric_neuro_ext55_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricBrainTumorStagingExt({}).function, 'PediatricBrainTumorStagingExt', 'PediatricBrainTumorStagingExt basic');
assertEq(PediatricGliomaMolecularExt({}).function, 'PediatricGliomaMolecularExt', 'PediatricGliomaMolecularExt basic');
assertEq(PediatricMedulloblastomaExt({}).function, 'PediatricMedulloblastomaExt', 'PediatricMedulloblastomaExt basic');
assertEq(PediatricEpendymomaExt({}).function, 'PediatricEpendymomaExt', 'PediatricEpendymomaExt basic');
assertEq(PediatricATRTClassificationExt({}).function, 'PediatricATRTClassificationExt', 'PediatricATRTClassificationExt basic');
assertEq(PediatricDNETExt({}).function, 'PediatricDNETExt', 'PediatricDNETExt basic');
assertEq(PediatricCraniopharyngiomaExt({}).function, 'PediatricCraniopharyngiomaExt', 'PediatricCraniopharyngiomaExt basic');
assertEq(PediatricPinealtumorExt({}).function, 'PediatricPinealtumorExt', 'PediatricPinealtumorExt basic');
assertEq(PediatricBrainstemGliomaExt({}).function, 'PediatricBrainstemGliomaExt', 'PediatricBrainstemGliomaExt basic');
assertEq(PediatricNeuroOncFollowupExt({}).function, 'PediatricNeuroOncFollowupExt', 'PediatricNeuroOncFollowupExt basic');
console.log('pcc_pediatric_neuro_ext55 unit: ' + passed + ' passed');