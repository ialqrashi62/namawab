// P3-EK pcc_pediatric_sleep unit tests
const Engine = require('./pcc_pediatric_sleep_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_sleep engine tests:');
it('PediatricSleepApnea', () => assertEq(Engine.PediatricSleepApnea({ t: 'yes' }).plan, 'pediatricSleepApnea-protocol'));
it('PediatricInsomnia', () => assertEq(Engine.PediatricInsomnia({ t: 'yes' }).plan, 'pediatricInsomnia-protocol'));
it('PediatricNarcolepsy', () => assertEq(Engine.PediatricNarcolepsy({ t: 'yes' }).plan, 'pediatricNarcolepsy-protocol'));
it('PediatricParasomnias', () => assertEq(Engine.PediatricParasomnias({ t: 'yes' }).plan, 'pediatricParasomnias-protocol'));
it('PediatricCircadianDisorder', () => assertEq(Engine.PediatricCircadianDisorder({ t: 'yes' }).plan, 'pediatricCircadianDisorder-protocol'));
it('PediatricRestlessLeg', () => assertEq(Engine.PediatricRestlessLeg({ t: 'yes' }).plan, 'pediatricRestlessLeg-protocol'));
it('PediatricSleepDisorderedBreathing', () => assertEq(Engine.PediatricSleepDisorderedBreathing({ t: 'yes' }).plan, 'pediatricSleepDisorderedBreathing-protocol'));
it('PediatricNightTerrors', () => assertEq(Engine.PediatricNightTerrors({ t: 'yes' }).plan, 'pediatricNightTerrors-protocol'));
it('PediatricBedwetting', () => assertEq(Engine.PediatricBedwetting({ t: 'yes' }).plan, 'pediatricBedwetting-protocol'));
it('PediatricSleepHygiene', () => assertEq(Engine.PediatricSleepHygiene({ t: 'yes' }).plan, 'pediatricSleepHygiene-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
