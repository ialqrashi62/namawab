// pcc_pediatric_neuro_ext10 unit test v3.120.0
const { PediatricLanguageDisorder, PediatricSpeechDelay, PediatricArticulationDisorder, PediatricPhonologicalDisorder, PediatricStuttering, PediatricApraxia, PediatricDysarthria, PediatricVoiceDisorder, PediatricDyslexia, PediatricDysgraphia } = require('./pcc_pediatric_neuro_ext10_engine');
const assert = require('assert');

let passed = 0;
assert.ok(PediatricLanguageDisorder()); passed++;
assert.ok(PediatricLanguageDisorder({a:1})); passed++;
assert.ok(PediatricSpeechDelay()); passed++;
assert.ok(PediatricSpeechDelay({a:1})); passed++;
assert.ok(PediatricArticulationDisorder()); passed++;
assert.ok(PediatricArticulationDisorder({a:1})); passed++;
assert.ok(PediatricPhonologicalDisorder()); passed++;
assert.ok(PediatricPhonologicalDisorder({a:1})); passed++;
assert.ok(PediatricStuttering()); passed++;
assert.ok(PediatricStuttering({a:1})); passed++;
assert.ok(PediatricApraxia()); passed++;
assert.ok(PediatricApraxia({a:1})); passed++;
assert.ok(PediatricDysarthria()); passed++;
assert.ok(PediatricDysarthria({a:1})); passed++;
assert.ok(PediatricVoiceDisorder()); passed++;
assert.ok(PediatricVoiceDisorder({a:1})); passed++;
assert.ok(PediatricDyslexia()); passed++;
assert.ok(PediatricDyslexia({a:1})); passed++;
assert.ok(PediatricDysgraphia()); passed++;
assert.ok(PediatricDysgraphia({a:1})); passed++;

console.log('pcc_pediatric_neuro_ext10 unit:', passed, 'passed');
