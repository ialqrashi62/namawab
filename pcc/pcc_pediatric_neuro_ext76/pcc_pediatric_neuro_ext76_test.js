// Auto-generated test
"use strict";
const {PediatricCognitiveDisorderExt, PediatricAnosognosiaExt, PediatricApraxiaExt, PediatricAgnosiaExt, PediatricExecDysfunctionExt, PediatricMemoryExt, PediatricVisuospatialExt, PediatricLanguageDisorderExt, PediatricBehavioralExecExt, PediatricTheoryMindExt} = require('./pcc_pediatric_neuro_ext76_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricCognitiveDisorderExt({}).function, 'PediatricCognitiveDisorderExt', 'PediatricCognitiveDisorderExt basic');
assertEq(PediatricAnosognosiaExt({}).function, 'PediatricAnosognosiaExt', 'PediatricAnosognosiaExt basic');
assertEq(PediatricApraxiaExt({}).function, 'PediatricApraxiaExt', 'PediatricApraxiaExt basic');
assertEq(PediatricAgnosiaExt({}).function, 'PediatricAgnosiaExt', 'PediatricAgnosiaExt basic');
assertEq(PediatricExecDysfunctionExt({}).function, 'PediatricExecDysfunctionExt', 'PediatricExecDysfunctionExt basic');
assertEq(PediatricMemoryExt({}).function, 'PediatricMemoryExt', 'PediatricMemoryExt basic');
assertEq(PediatricVisuospatialExt({}).function, 'PediatricVisuospatialExt', 'PediatricVisuospatialExt basic');
assertEq(PediatricLanguageDisorderExt({}).function, 'PediatricLanguageDisorderExt', 'PediatricLanguageDisorderExt basic');
assertEq(PediatricBehavioralExecExt({}).function, 'PediatricBehavioralExecExt', 'PediatricBehavioralExecExt basic');
assertEq(PediatricTheoryMindExt({}).function, 'PediatricTheoryMindExt', 'PediatricTheoryMindExt basic');
console.log('pcc_pediatric_neuro_ext76 unit: ' + passed + ' passed');