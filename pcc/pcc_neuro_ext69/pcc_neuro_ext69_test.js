// Auto-generated test
"use strict";
const {HeadacheClassificationExt, MigraineProphylaxisExt, ClusterHeadacheExt, TensionHeadacheExt, TrigeminalNeuralgiaExt, MedicationOveruseHeadacheExt, ThunderclapHeadacheExt, CervicogenicHeadacheExt, PostConcussionHeadacheExt, IdiopathicIntracranialHypertensionHeadacheExt} = require('./pcc_neuro_ext69_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(HeadacheClassificationExt({}).function, 'HeadacheClassificationExt', 'HeadacheClassificationExt basic');
assertEq(MigraineProphylaxisExt({}).function, 'MigraineProphylaxisExt', 'MigraineProphylaxisExt basic');
assertEq(ClusterHeadacheExt({}).function, 'ClusterHeadacheExt', 'ClusterHeadacheExt basic');
assertEq(TensionHeadacheExt({}).function, 'TensionHeadacheExt', 'TensionHeadacheExt basic');
assertEq(TrigeminalNeuralgiaExt({}).function, 'TrigeminalNeuralgiaExt', 'TrigeminalNeuralgiaExt basic');
assertEq(MedicationOveruseHeadacheExt({}).function, 'MedicationOveruseHeadacheExt', 'MedicationOveruseHeadacheExt basic');
assertEq(ThunderclapHeadacheExt({}).function, 'ThunderclapHeadacheExt', 'ThunderclapHeadacheExt basic');
assertEq(CervicogenicHeadacheExt({}).function, 'CervicogenicHeadacheExt', 'CervicogenicHeadacheExt basic');
assertEq(PostConcussionHeadacheExt({}).function, 'PostConcussionHeadacheExt', 'PostConcussionHeadacheExt basic');
assertEq(IdiopathicIntracranialHypertensionHeadacheExt({}).function, 'IdiopathicIntracranialHypertensionHeadacheExt', 'IdiopathicIntracranialHypertensionHeadacheExt basic');
console.log('pcc_neuro_ext69 unit: ' + passed + ' passed');