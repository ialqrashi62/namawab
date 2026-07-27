// P3-ED pcc_pediatric_urology unit tests
const Engine = require('./pcc_pediatric_urology_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_urology engine tests:');
it('HypospadiasRepairTiming', () => assertEq(Engine.HypospadiasRepairTiming({ t: 'yes' }).plan, 'hypospadiasRepairTiming-protocol'));
it('UndescendedTestisManagement', () => assertEq(Engine.UndescendedTestisManagement({ t: 'yes' }).plan, 'undescendedTestisManagement-protocol'));
it('VesicoureteralRefluxGrading', () => assertEq(Engine.VesicoureteralRefluxGrading({ t: 'yes' }).plan, 'vesicoureteralRefluxGrading-protocol'));
it('PediatricUreteralReimplant', () => assertEq(Engine.PediatricUreteralReimplant({ t: 'yes' }).plan, 'pediatricUreteralReimplant-protocol'));
it('BladderExstrophyClosure', () => assertEq(Engine.BladderExstrophyClosure({ t: 'yes' }).plan, 'bladderExstrophyClosure-protocol'));
it('PosteriorUrethralValves', () => assertEq(Engine.PosteriorUrethralValves({ t: 'yes' }).plan, 'posteriorUrethralValves-protocol'));
it('PediatricKidneyStones', () => assertEq(Engine.PediatricKidneyStones({ t: 'yes' }).plan, 'pediatricKidneyStones-protocol'));
it('CircumcisionDecision', () => assertEq(Engine.CircumcisionDecision({ t: 'yes' }).plan, 'circumcisionDecision-protocol'));
it('PediatricIncontinence', () => assertEq(Engine.PediatricIncontinence({ t: 'yes' }).plan, 'pediatricIncontinence-protocol'));
it('DisordersOfSexDevelopment', () => assertEq(Engine.DisordersOfSexDevelopment({ t: 'yes' }).plan, 'disordersOfSexDevelopment-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
