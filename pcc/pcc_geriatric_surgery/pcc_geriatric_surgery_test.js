// P3-CZ pcc_geriatric_surgery unit tests
const Engine = require('./pcc_geriatric_surgery_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_geriatric_surgery engine tests:');
it('FrailtyIndex', () => assertEq(Engine.FrailtyIndex({ t: 'yes' }).plan, 'frailtyindex-protocol'));
it('Prehabilitation', () => assertEq(Engine.Prehabilitation({ t: 'yes' }).plan, 'prehabilitation-protocol'));
it('DeliriumRisk', () => assertEq(Engine.DeliriumRisk({ t: 'yes' }).plan, 'deliriumrisk-protocol'));
it('NutritionScreen', () => assertEq(Engine.NutritionScreen({ t: 'yes' }).plan, 'nutritionscreen-protocol'));
it('Polypharmacy', () => assertEq(Engine.Polypharmacy({ t: 'yes' }).plan, 'polypharmacy-protocol'));
it('MobilityPlan', () => assertEq(Engine.MobilityPlan({ t: 'yes' }).plan, 'mobilityplan-protocol'));
it('DischargeDestination', () => assertEq(Engine.DischargeDestination({ t: 'yes' }).plan, 'dischargedestination-protocol'));
it('ComplicationRisk', () => assertEq(Engine.ComplicationRisk({ t: 'yes' }).plan, 'complicationrisk-protocol'));
it('PalliativeTalk', () => assertEq(Engine.PalliativeTalk({ t: 'yes' }).plan, 'palliativetalk-protocol'));
it('FollowUp', () => assertEq(Engine.FollowUp({ t: 'yes' }).plan, 'followup-protocol'));
console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
