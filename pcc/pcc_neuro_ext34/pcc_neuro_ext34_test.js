// pcc_neuro_ext34 unit test v3.133.0
const { CognitiveRehabExt, MemoryRehabilitation, AttentionTraining, ExecutiveFunctionTraining, LanguageTherapyExt, SpeechTherapy, OccupationalTherapyExt, VestibularRehab, VisualRehab, NeuroplasticityTraining } = require('./pcc_neuro_ext34_engine');
const assert = require('assert');

let passed = 0;
assert.ok(CognitiveRehabExt()); passed++;
assert.ok(CognitiveRehabExt({a:1})); passed++;
assert.ok(MemoryRehabilitation()); passed++;
assert.ok(MemoryRehabilitation({a:1})); passed++;
assert.ok(AttentionTraining()); passed++;
assert.ok(AttentionTraining({a:1})); passed++;
assert.ok(ExecutiveFunctionTraining()); passed++;
assert.ok(ExecutiveFunctionTraining({a:1})); passed++;
assert.ok(LanguageTherapyExt()); passed++;
assert.ok(LanguageTherapyExt({a:1})); passed++;
assert.ok(SpeechTherapy()); passed++;
assert.ok(SpeechTherapy({a:1})); passed++;
assert.ok(OccupationalTherapyExt()); passed++;
assert.ok(OccupationalTherapyExt({a:1})); passed++;
assert.ok(VestibularRehab()); passed++;
assert.ok(VestibularRehab({a:1})); passed++;
assert.ok(VisualRehab()); passed++;
assert.ok(VisualRehab({a:1})); passed++;
assert.ok(NeuroplasticityTraining()); passed++;
assert.ok(NeuroplasticityTraining({a:1})); passed++;

console.log('pcc_neuro_ext34 unit:', passed, 'passed');
