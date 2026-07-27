// P3-CW pcc_occupational_health unit tests
const Engine = require('./pcc_occupational_health_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_occupational_health engine tests:');
it('Fitness', () => assertEq(Engine.Fitness({ t: 'yes' }).plan, 'fitness-protocol'));
it('Exposure', () => assertEq(Engine.Exposure({ t: 'yes' }).plan, 'exposure-protocol'));
it('Vaccination', () => assertEq(Engine.Vaccination({ t: 'yes' }).plan, 'vaccination-protocol'));
it('Injury', () => assertEq(Engine.Injury({ t: 'yes' }).plan, 'injury-protocol'));
it('ReturnToWork', () => assertEq(Engine.ReturnToWork({ t: 'yes' }).plan, 'returntowork-protocol'));
it('Hearing', () => assertEq(Engine.Hearing({ t: 'yes' }).plan, 'hearing-protocol'));
it('Vision', () => assertEq(Engine.Vision({ t: 'yes' }).plan, 'vision-protocol'));
it('Respiratory', () => assertEq(Engine.Respiratory({ t: 'yes' }).plan, 'respiratory-protocol'));
it('Chemical', () => assertEq(Engine.Chemical({ t: 'yes' }).plan, 'chemical-protocol'));
it('Ergonomics', () => assertEq(Engine.Ergonomics({ t: 'yes' }).plan, 'ergonomics-protocol'));
console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
