// P3-DJ pcc_pulmonary_advanced unit tests
const Engine = require('./pcc_pulmonary_advanced_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pulmonary_advanced engine tests:');
it('SpirometryPattern', () => assertEq(Engine.SpirometryPattern({ t: 'yes' }).plan, 'spirometrypattern-protocol'));
it('DiffusionCapacity', () => assertEq(Engine.DiffusionCapacity({ t: 'yes' }).plan, 'diffusioncapacity-protocol'));
it('Bronchoprovocation', () => assertEq(Engine.Bronchoprovocation({ t: 'yes' }).plan, 'bronchoprovocation-protocol'));
it('EosinophilicAsthma', () => assertEq(Engine.EosinophilicAsthma({ t: 'yes' }).plan, 'eosinophilicasthma-protocol'));
it('COPDExacerbation', () => assertEq(Engine.COPDExacerbation({ t: 'yes' }).plan, 'copdexacerbation-protocol'));
it('InterstitialLung', () => assertEq(Engine.InterstitialLung({ t: 'yes' }).plan, 'interstitiallung-protocol'));
it('PulmonaryRehab', () => assertEq(Engine.PulmonaryRehab({ t: 'yes' }).plan, 'pulmonaryrehab-protocol'));
it('OxygenTherapy', () => assertEq(Engine.OxygenTherapy({ t: 'yes' }).plan, 'oxygentherapy-protocol'));
it('VentilatorySupport', () => assertEq(Engine.VentilatorySupport({ t: 'yes' }).plan, 'ventilatorysupport-protocol'));
it('LungTransplant', () => assertEq(Engine.LungTransplant({ t: 'yes' }).plan, 'lungtransplant-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
