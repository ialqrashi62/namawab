// Auto-generated test
"use strict";
const {CognitiveDisorderExt, AnosognosiaExt, ApraxiaExt, AgnosiaExt, ExecutiveDysfunctionExt, MemoryDisorderExt, VisuospatialExt, LanguageDisorderExt, BehavioralDysexecutiveExt, SocialCognitionExt} = require('./pcc_neuro_ext87_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(CognitiveDisorderExt({}).function, 'CognitiveDisorderExt', 'CognitiveDisorderExt basic');
assertEq(AnosognosiaExt({}).function, 'AnosognosiaExt', 'AnosognosiaExt basic');
assertEq(ApraxiaExt({}).function, 'ApraxiaExt', 'ApraxiaExt basic');
assertEq(AgnosiaExt({}).function, 'AgnosiaExt', 'AgnosiaExt basic');
assertEq(ExecutiveDysfunctionExt({}).function, 'ExecutiveDysfunctionExt', 'ExecutiveDysfunctionExt basic');
assertEq(MemoryDisorderExt({}).function, 'MemoryDisorderExt', 'MemoryDisorderExt basic');
assertEq(VisuospatialExt({}).function, 'VisuospatialExt', 'VisuospatialExt basic');
assertEq(LanguageDisorderExt({}).function, 'LanguageDisorderExt', 'LanguageDisorderExt basic');
assertEq(BehavioralDysexecutiveExt({}).function, 'BehavioralDysexecutiveExt', 'BehavioralDysexecutiveExt basic');
assertEq(SocialCognitionExt({}).function, 'SocialCognitionExt', 'SocialCognitionExt basic');
console.log('pcc_neuro_ext87 unit: ' + passed + ' passed');