// P3-EM pcc_pediatric_rehab unit tests
const Engine = require('./pcc_pediatric_rehab_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_rehab engine tests:');
it('PediatricRehabAssessment', () => assertEq(Engine.PediatricRehabAssessment({ t: 'yes' }).plan, 'pediatricRehabAssessment-protocol'));
it('PediatricPT', () => assertEq(Engine.PediatricPT({ t: 'yes' }).plan, 'pediatricPT-protocol'));
it('PediatricOT', () => assertEq(Engine.PediatricOT({ t: 'yes' }).plan, 'pediatricOT-protocol'));
it('PediatricSpeechRehab', () => assertEq(Engine.PediatricSpeechRehab({ t: 'yes' }).plan, 'pediatricSpeechRehab-protocol'));
it('PediatricCognitiveRehab', () => assertEq(Engine.PediatricCognitiveRehab({ t: 'yes' }).plan, 'pediatricCognitiveRehab-protocol'));
it('PediatricAquaticTherapy', () => assertEq(Engine.PediatricAquaticTherapy({ t: 'yes' }).plan, 'pediatricAquaticTherapy-protocol'));
it('PediatricConstraintTherapy', () => assertEq(Engine.PediatricConstraintTherapy({ t: 'yes' }).plan, 'pediatricConstraintTherapy-protocol'));
it('PediatricRoboticRehab', () => assertEq(Engine.PediatricRoboticRehab({ t: 'yes' }).plan, 'pediatricRoboticRehab-protocol'));
it('PediatricGaitTraining', () => assertEq(Engine.PediatricGaitTraining({ t: 'yes' }).plan, 'pediatricGaitTraining-protocol'));
it('PediatricSportsRehab', () => assertEq(Engine.PediatricSportsRehab({ t: 'yes' }).plan, 'pediatricSportsRehab-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
