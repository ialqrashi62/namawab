// P3-ER pcc_pediatric_neuro_ext unit tests
const Engine = require('./pcc_pediatric_neuro_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_neuro_ext engine tests:');
it('PediatricEpilepsyExt', () => assertEq(Engine.PediatricEpilepsyExt({ t: 'yes' }).plan, 'pediatricEpilepsyExt-protocol'));
it('PediatricSeizureEvalExt', () => assertEq(Engine.PediatricSeizureEvalExt({ t: 'yes' }).plan, 'pediatricSeizureEvalExt-protocol'));
it('PediatricHeadacheEvalExt', () => assertEq(Engine.PediatricHeadacheEvalExt({ t: 'yes' }).plan, 'pediatricHeadacheEvalExt-protocol'));
it('PediatricMigraineExt', () => assertEq(Engine.PediatricMigraineExt({ t: 'yes' }).plan, 'pediatricMigraineExt-protocol'));
it('PediatricStrokeExt', () => assertEq(Engine.PediatricStrokeExt({ t: 'yes' }).plan, 'pediatricStrokeExt-protocol'));
it('PediatricMovementDisorderExt', () => assertEq(Engine.PediatricMovementDisorderExt({ t: 'yes' }).plan, 'pediatricMovementDisorderExt-protocol'));
it('PediatricNeurocutaneousExt', () => assertEq(Engine.PediatricNeurocutaneousExt({ t: 'yes' }).plan, 'pediatricNeurocutaneousExt-protocol'));
it('PediatricNeuromuscularExt', () => assertEq(Engine.PediatricNeuromuscularExt({ t: 'yes' }).plan, 'pediatricNeuromuscularExt-protocol'));
it('PediatricCerebrovascularExt', () => assertEq(Engine.PediatricCerebrovascularExt({ t: 'yes' }).plan, 'pediatricCerebrovascularExt-protocol'));
it('PediatricNeuroimmunologyExt', () => assertEq(Engine.PediatricNeuroimmunologyExt({ t: 'yes' }).plan, 'pediatricNeuroimmunologyExt-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
