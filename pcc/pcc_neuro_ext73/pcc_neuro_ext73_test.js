// Auto-generated test
"use strict";
const {TraumaticBrainInjuryExt, ConcussionAssessmentExt, PostConcussionSyndromeExt, ChronicTBIExt, SkullFractureExt, EpiduralHematomaExt, SubduralHematomaExt, TraumaticSAHExt, DiffuseAxonalInjuryExt, CerebralEdemaTBIExt} = require('./pcc_neuro_ext73_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(TraumaticBrainInjuryExt({}).function, 'TraumaticBrainInjuryExt', 'TraumaticBrainInjuryExt basic');
assertEq(ConcussionAssessmentExt({}).function, 'ConcussionAssessmentExt', 'ConcussionAssessmentExt basic');
assertEq(PostConcussionSyndromeExt({}).function, 'PostConcussionSyndromeExt', 'PostConcussionSyndromeExt basic');
assertEq(ChronicTBIExt({}).function, 'ChronicTBIExt', 'ChronicTBIExt basic');
assertEq(SkullFractureExt({}).function, 'SkullFractureExt', 'SkullFractureExt basic');
assertEq(EpiduralHematomaExt({}).function, 'EpiduralHematomaExt', 'EpiduralHematomaExt basic');
assertEq(SubduralHematomaExt({}).function, 'SubduralHematomaExt', 'SubduralHematomaExt basic');
assertEq(TraumaticSAHExt({}).function, 'TraumaticSAHExt', 'TraumaticSAHExt basic');
assertEq(DiffuseAxonalInjuryExt({}).function, 'DiffuseAxonalInjuryExt', 'DiffuseAxonalInjuryExt basic');
assertEq(CerebralEdemaTBIExt({}).function, 'CerebralEdemaTBIExt', 'CerebralEdemaTBIExt basic');
console.log('pcc_neuro_ext73 unit: ' + passed + ' passed');