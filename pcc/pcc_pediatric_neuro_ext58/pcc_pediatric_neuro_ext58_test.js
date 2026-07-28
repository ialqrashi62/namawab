// Auto-generated test
"use strict";
const {PediatricHeadacheExt, PediatricMigraineExt, PediatricClusterHeadacheExt, PediatricTensionHeadacheExt, PediatricTrigeminalExt, PediatricMOHExt, PediatricThunderclapHeadacheExt, PediatricCervicogenicExt, PediatricPostConcussionExt, PediatricIIHHeadacheExt} = require('./pcc_pediatric_neuro_ext58_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricHeadacheExt({}).function, 'PediatricHeadacheExt', 'PediatricHeadacheExt basic');
assertEq(PediatricMigraineExt({}).function, 'PediatricMigraineExt', 'PediatricMigraineExt basic');
assertEq(PediatricClusterHeadacheExt({}).function, 'PediatricClusterHeadacheExt', 'PediatricClusterHeadacheExt basic');
assertEq(PediatricTensionHeadacheExt({}).function, 'PediatricTensionHeadacheExt', 'PediatricTensionHeadacheExt basic');
assertEq(PediatricTrigeminalExt({}).function, 'PediatricTrigeminalExt', 'PediatricTrigeminalExt basic');
assertEq(PediatricMOHExt({}).function, 'PediatricMOHExt', 'PediatricMOHExt basic');
assertEq(PediatricThunderclapHeadacheExt({}).function, 'PediatricThunderclapHeadacheExt', 'PediatricThunderclapHeadacheExt basic');
assertEq(PediatricCervicogenicExt({}).function, 'PediatricCervicogenicExt', 'PediatricCervicogenicExt basic');
assertEq(PediatricPostConcussionExt({}).function, 'PediatricPostConcussionExt', 'PediatricPostConcussionExt basic');
assertEq(PediatricIIHHeadacheExt({}).function, 'PediatricIIHHeadacheExt', 'PediatricIIHHeadacheExt basic');
console.log('pcc_pediatric_neuro_ext58 unit: ' + passed + ' passed');