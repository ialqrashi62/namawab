// P3-EE pcc_pediatric_neuro unit tests
const Engine = require('./pcc_pediatric_neuro_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_neuro engine tests:');
it('PediatricEpilepsySyndrome', () => assertEq(Engine.PediatricEpilepsySyndrome({ t: 'yes' }).plan, 'pediatricEpilepsySyndrome-protocol'));
it('CerebralPalsyClassification', () => assertEq(Engine.CerebralPalsyClassification({ t: 'yes' }).plan, 'cerebralPalsyClassification-protocol'));
it('PediatricStrokeWorkup', () => assertEq(Engine.PediatricStrokeWorkup({ t: 'yes' }).plan, 'pediatricStrokeWorkup-protocol'));
it('NeurocutaneousSyndrome', () => assertEq(Engine.NeurocutaneousSyndrome({ t: 'yes' }).plan, 'neurocutaneousSyndrome-protocol'));
it('PediatricMigraineManagement', () => assertEq(Engine.PediatricMigraineManagement({ t: 'yes' }).plan, 'pediatricMigraineManagement-protocol'));
it('FebrileSeizureRisk', () => assertEq(Engine.FebrileSeizureRisk({ t: 'yes' }).plan, 'febrileSeizureRisk-protocol'));
it('NeurodegenerativePediatric', () => assertEq(Engine.NeurodegenerativePediatric({ t: 'yes' }).plan, 'neurodegenerativePediatric-protocol'));
it('PediatricMovementDisorder', () => assertEq(Engine.PediatricMovementDisorder({ t: 'yes' }).plan, 'pediatricMovementDisorder-protocol'));
it('PediatricNeurometabolic', () => assertEq(Engine.PediatricNeurometabolic({ t: 'yes' }).plan, 'pediatricNeurometabolic-protocol'));
it('CNSDevelopmentalDelay', () => assertEq(Engine.CNSDevelopmentalDelay({ t: 'yes' }).plan, 'cNSDevelopmentalDelay-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
