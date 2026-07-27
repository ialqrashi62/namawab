// P3-CX pcc_smoking_cessation unit tests
const Engine = require('./pcc_smoking_cessation_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_smoking_cessation engine tests:');
it('Readiness', () => assertEq(Engine.Readiness({ t: 'yes' }).plan, 'readiness-protocol'));
it('PackYears', () => assertEq(Engine.PackYears({ t: 'yes' }).plan, 'packyears-protocol'));
it('Fagerstrom', () => assertEq(Engine.Fagerstrom({ t: 'yes' }).plan, 'fagerstrom-protocol'));
it('QuitPlan', () => assertEq(Engine.QuitPlan({ t: 'yes' }).plan, 'quitplan-protocol'));
it('Nrt', () => assertEq(Engine.Nrt({ t: 'yes' }).plan, 'nrt-protocol'));
it('Varenicline', () => assertEq(Engine.Varenicline({ t: 'yes' }).plan, 'varenicline-protocol'));
it('Bupropion', () => assertEq(Engine.Bupropion({ t: 'yes' }).plan, 'bupropion-protocol'));
it('Counseling', () => assertEq(Engine.Counseling({ t: 'yes' }).plan, 'counseling-protocol'));
it('Relapse', () => assertEq(Engine.Relapse({ t: 'yes' }).plan, 'relapse-protocol'));
it('CarbonMonoxide', () => assertEq(Engine.CarbonMonoxide({ t: 'yes' }).plan, 'carbonmonoxide-protocol'));
console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
