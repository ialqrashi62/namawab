// P3-CW pcc_sleep_med unit tests
const Engine = require('./pcc_sleep_med_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_sleep_med engine tests:');
it('Ahi', () => assertEq(Engine.Ahi({ t: 'yes' }).plan, 'ahi-protocol'));
it('Insomnia', () => assertEq(Engine.Insomnia({ t: 'yes' }).plan, 'insomnia-protocol'));
it('Cpap', () => assertEq(Engine.Cpap({ t: 'yes' }).plan, 'cpap-protocol'));
it('Daytime', () => assertEq(Engine.Daytime({ t: 'yes' }).plan, 'daytime-protocol'));
it('Apnea', () => assertEq(Engine.Apnea({ t: 'yes' }).plan, 'apnea-protocol'));
it('Oxygen', () => assertEq(Engine.Oxygen({ t: 'yes' }).plan, 'oxygen-protocol'));
it('Restless', () => assertEq(Engine.Restless({ t: 'yes' }).plan, 'restless-protocol'));
it('Narcolepsy', () => assertEq(Engine.Narcolepsy({ t: 'yes' }).plan, 'narcolepsy-protocol'));
it('Parasomnia', () => assertEq(Engine.Parasomnia({ t: 'yes' }).plan, 'parasomnia-protocol'));
it('Hypopnea', () => assertEq(Engine.Hypopnea({ t: 'yes' }).plan, 'hypopnea-protocol'));
console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
