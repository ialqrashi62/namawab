// P3-EI pcc_neuropsych_ext2 unit tests
const Engine = require('./pcc_neuropsych_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuropsych_ext2 engine tests:');
it('NeurocognitiveDisorderMajor', () => assertEq(Engine.NeurocognitiveDisorderMajor({ t: 'yes' }).plan, 'neurocognitiveDisorderMajor-protocol'));
it('FrontotemporalDementia', () => assertEq(Engine.FrontotemporalDementia({ t: 'yes' }).plan, 'frontotemporalDementia-protocol'));
it('LewyBodyDementia', () => assertEq(Engine.LewyBodyDementia({ t: 'yes' }).plan, 'lewyBodyDementia-protocol'));
it('VascularDementia', () => assertEq(Engine.VascularDementia({ t: 'yes' }).plan, 'vascularDementia-protocol'));
it('MildCognitiveImpairment', () => assertEq(Engine.MildCognitiveImpairment({ t: 'yes' }).plan, 'mildCognitiveImpairment-protocol'));
it('WernickeKorsakoff', () => assertEq(Engine.WernickeKorsakoff({ t: 'yes' }).plan, 'wernickeKorsakoff-protocol'));
it('TraumaticBrainInjuryCognitive', () => assertEq(Engine.TraumaticBrainInjuryCognitive({ t: 'yes' }).plan, 'traumaticBrainInjuryCognitive-protocol'));
it('PostConcussionSyndrome', () => assertEq(Engine.PostConcussionSyndrome({ t: 'yes' }).plan, 'postConcussionSyndrome-protocol'));
it('ChemotherapyRelatedCognitive', () => assertEq(Engine.ChemotherapyRelatedCognitive({ t: 'yes' }).plan, 'chemotherapyRelatedCognitive-protocol'));
it('AutoimmuneEncephalitisCognitive', () => assertEq(Engine.AutoimmuneEncephalitisCognitive({ t: 'yes' }).plan, 'autoimmuneEncephalitisCognitive-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
