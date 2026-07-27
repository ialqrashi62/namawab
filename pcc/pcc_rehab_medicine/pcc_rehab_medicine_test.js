// P3-CZ pcc_rehab_medicine unit tests
const Engine = require('./pcc_rehab_medicine_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_rehab_medicine engine tests:');
it('FunctionalStatus', () => assertEq(Engine.FunctionalStatus({ t: 'yes' }).plan, 'functionalstatus-protocol'));
it('Impairment', () => assertEq(Engine.Impairment({ t: 'yes' }).plan, 'impairment-protocol'));
it('GoalSetting', () => assertEq(Engine.GoalSetting({ t: 'yes' }).plan, 'goalsetting-protocol'));
it('TherapyPlan', () => assertEq(Engine.TherapyPlan({ t: 'yes' }).plan, 'therapyplan-protocol'));
it('OutcomeMeasure', () => assertEq(Engine.OutcomeMeasure({ t: 'yes' }).plan, 'outcomemeasure-protocol'));
it('DischargePlan', () => assertEq(Engine.DischargePlan({ t: 'yes' }).plan, 'dischargeplan-protocol'));
it('Equipment', () => assertEq(Engine.Equipment({ t: 'yes' }).plan, 'equipment-protocol'));
it('Caregiver', () => assertEq(Engine.Caregiver({ t: 'yes' }).plan, 'caregiver-protocol'));
it('CommunityReintegration', () => assertEq(Engine.CommunityReintegration({ t: 'yes' }).plan, 'communityreintegration-protocol'));
it('QualityOfLife', () => assertEq(Engine.QualityOfLife({ t: 'yes' }).plan, 'qualityoflife-protocol'));
console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
