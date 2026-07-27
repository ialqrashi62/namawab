// P3-CK pcc_neuro_ext2 unit tests
const Engine = require('./pcc_neuro_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_neuro_ext2 engine tests:');
it('SS', () => assertEq(Engine.StrokeScale({ s: 25 }).plan, 'severe-stroke'));
it('Sz', () => assertEq(Engine.Seizure({ t: 'status' }).plan, 'status-epilepticus'));
it('HA', () => assertEq(Engine.Headache({ t: 'thunderclap' }).plan, 'subarachnoid-rule-out'));
it('GCS', () => assertEq(Engine.GCS({ s: 7 }).plan, 'severe-TBI'));
it('NP', () => assertEq(Engine.Neuropathy({ t: 'diabetic' }).plan, 'diabetic-neuropathy'));
it('Mv', () => assertEq(Engine.Movement({ d: 'parkinsonism' }).plan, 'parkinsonism-care'));
it('Dem', () => assertEq(Engine.Dementia({ m: 18 }).plan, 'moderate-dementia'));
it('MS', () => assertEq(Engine.Ms({ t: 'relapse' }).plan, 'MS-relapse'));
it('Gbs', () => assertEq(Engine.Gbs({ s: 'severe' }).plan, 'severe-GBS-IVIG'));
it('My', () => assertEq(Engine.Myasthenia({ t: 'crisis' }).plan, 'myasthenic-crisis'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
