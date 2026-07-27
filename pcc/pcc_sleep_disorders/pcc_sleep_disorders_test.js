// P3-DJ pcc_sleep_disorders unit tests
const Engine = require('./pcc_sleep_disorders_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_sleep_disorders engine tests:');
it('SleepApnea', () => assertEq(Engine.SleepApnea({ t: 'yes' }).plan, 'sleepapnea-protocol'));
it('InsomniaCBT', () => assertEq(Engine.InsomniaCBT({ t: 'yes' }).plan, 'insomniacbt-protocol'));
it('CircadianRhythm', () => assertEq(Engine.CircadianRhythm({ t: 'yes' }).plan, 'circadianrhythm-protocol'));
it('RestlessLegs', () => assertEq(Engine.RestlessLegs({ t: 'yes' }).plan, 'restlesslegs-protocol'));
it('Narcolepsy', () => assertEq(Engine.Narcolepsy({ t: 'yes' }).plan, 'narcolepsy-protocol'));
it('Parasomnias', () => assertEq(Engine.Parasomnias({ t: 'yes' }).plan, 'parasomnias-protocol'));
it('Hypersomnia', () => assertEq(Engine.Hypersomnia({ t: 'yes' }).plan, 'hypersomnia-protocol'));
it('SleepHygieneAdvanced', () => assertEq(Engine.SleepHygieneAdvanced({ t: 'yes' }).plan, 'sleephygieneadvanced-protocol'));
it('CPAPTitration', () => assertEq(Engine.CPAPTitration({ t: 'yes' }).plan, 'cpaptitration-protocol'));
it('SleepSurgery', () => assertEq(Engine.SleepSurgery({ t: 'yes' }).plan, 'sleepsurgery-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
