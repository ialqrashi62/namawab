// P3-DA pcc_longevity_medicine unit tests
const Engine = require('./pcc_longevity_medicine_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_longevity_medicine engine tests:');
it('BiologicalAge', () => assertEq(Engine.BiologicalAge({ t: 'yes' }).plan, 'biologicalage-protocol'));
it('Senolytics', () => assertEq(Engine.Senolytics({ t: 'yes' }).plan, 'senolytics-protocol'));
it('HormoneOptimization', () => assertEq(Engine.HormoneOptimization({ t: 'yes' }).plan, 'hormoneoptimization-protocol'));
it('MetabolicHealth', () => assertEq(Engine.MetabolicHealth({ t: 'yes' }).plan, 'metabolichealth-protocol'));
it('CognitivePreservation', () => assertEq(Engine.CognitivePreservation({ t: 'yes' }).plan, 'cognitivepreservation-protocol'));
it('MuscleMass', () => assertEq(Engine.MuscleMass({ t: 'yes' }).plan, 'musclemass-protocol'));
it('CardiovascularFitness', () => assertEq(Engine.CardiovascularFitness({ t: 'yes' }).plan, 'cardiovascularfitness-protocol'));
it('Nutraceuticals', () => assertEq(Engine.Nutraceuticals({ t: 'yes' }).plan, 'nutraceuticals-protocol'));
it('LifestyleScore', () => assertEq(Engine.LifestyleScore({ t: 'yes' }).plan, 'lifestylescore-protocol'));
it('MortalityRisk', () => assertEq(Engine.MortalityRisk({ t: 'yes' }).plan, 'mortalityrisk-protocol'));
console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
