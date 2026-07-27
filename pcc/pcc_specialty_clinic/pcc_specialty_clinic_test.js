// P3-CT pcc_specialty_clinic unit tests
const Engine = require('./pcc_specialty_clinic_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_specialty_clinic engine tests:');
it('R', () => assertEq(Engine.Referral({ s: 'cardio' }).plan, 'cardio-referral'));
it('C', () => assertEq(Engine.Consult({ t: 'initial' }).plan, 'initial-consult'));
it('S', () => assertEq(Engine.SecondOpinion({ t: 'requested' }).plan, 'second-opinion'));
it('F', () => assertEq(Engine.FollowUp({ d: 90 }).plan, '90-day-followup'));
it('Pr', () => assertEq(Engine.Procedure({ t: 'scope' }).plan, 'specialty-procedure'));
it('Tg', () => assertEq(Engine.Triage({ l: 1 }).plan, 'urgent-specialty'));
it('Ne', () => assertEq(Engine.NextStep({ t: 'imaging' }).plan, 'imaging-ordered'));
it('In', () => assertEq(Engine.Interval({ t: 'active' }).plan, 'active-treatment-interval'));
it('Co', () => assertEq(Engine.Coord({ t: 'multi' }).plan, 'multi-specialty-coord'));
it('Tr', () => assertEq(Engine.Transition({ t: 'PCP' }).plan, 'PCP-transition'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
