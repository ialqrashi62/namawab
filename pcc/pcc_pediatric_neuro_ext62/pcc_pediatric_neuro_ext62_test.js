// Auto-generated test
"use strict";
const {PediatricTBIExt, PediatricConcussionExt, PediatricPostConcussionExt, PediatricChronicTBIExt, PediatricSkullFractureExt, PediatricEpiduralHematomaExt, PediatricSubduralHematomaExt, PediatricTraumaticSAHExt, PediatricDiffuseAxonalInjuryExt, PediatricCerebralEdemaExt} = require('./pcc_pediatric_neuro_ext62_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricTBIExt({}).function, 'PediatricTBIExt', 'PediatricTBIExt basic');
assertEq(PediatricConcussionExt({}).function, 'PediatricConcussionExt', 'PediatricConcussionExt basic');
assertEq(PediatricPostConcussionExt({}).function, 'PediatricPostConcussionExt', 'PediatricPostConcussionExt basic');
assertEq(PediatricChronicTBIExt({}).function, 'PediatricChronicTBIExt', 'PediatricChronicTBIExt basic');
assertEq(PediatricSkullFractureExt({}).function, 'PediatricSkullFractureExt', 'PediatricSkullFractureExt basic');
assertEq(PediatricEpiduralHematomaExt({}).function, 'PediatricEpiduralHematomaExt', 'PediatricEpiduralHematomaExt basic');
assertEq(PediatricSubduralHematomaExt({}).function, 'PediatricSubduralHematomaExt', 'PediatricSubduralHematomaExt basic');
assertEq(PediatricTraumaticSAHExt({}).function, 'PediatricTraumaticSAHExt', 'PediatricTraumaticSAHExt basic');
assertEq(PediatricDiffuseAxonalInjuryExt({}).function, 'PediatricDiffuseAxonalInjuryExt', 'PediatricDiffuseAxonalInjuryExt basic');
assertEq(PediatricCerebralEdemaExt({}).function, 'PediatricCerebralEdemaExt', 'PediatricCerebralEdemaExt basic');
console.log('pcc_pediatric_neuro_ext62 unit: ' + passed + ' passed');