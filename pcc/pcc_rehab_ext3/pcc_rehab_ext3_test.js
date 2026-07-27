// P3-CP pcc_rehab_ext3 unit tests
const Engine = require('./pcc_rehab_ext3_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_rehab_ext3 engine tests:');
it('PT', () => assertEq(Engine.PhysTherapy({ f: 'knee' }).plan, 'knee-PT'));
it('OT', () => assertEq(Engine.OccTherapy({ f: 'ADL' }).plan, 'ADL-training'));
it('ST', () => assertEq(Engine.SpeechLang({ t: 'dysphagia' }).plan, 'dysphagia-SLP'));
it('PT2', () => assertEq(Engine.PostStroke({ d: 7 }).plan, 'subacute-stroke-rehab'));
it('Sci', () => assertEq(Engine.Sci({ l: 'T6' }).plan, 'T6-paraplegic-rehab'));
it('TBI', () => assertEq(Engine.Tbi({ t: 'severe' }).plan, 'severe-TBI-rehab'));
it('AMP', () => assertEq(Engine.Amp({ l: 'AK' }).plan, 'AK-amputee-rehab'));
it('Burn', () => assertEq(Engine.Burnr({ tbsa: 30 }).plan, 'major-burn-rehab'));
it('Pre', () => assertEq(Engine.PreOp({ t: 'THA' }).plan, 'THA-prehab'));
it('BTR', () => assertEq(Engine.Back({ t: 'chronic' }).plan, 'chronic-back-rehab'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
