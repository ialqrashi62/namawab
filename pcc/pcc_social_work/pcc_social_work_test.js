// P3-CQ pcc_social_work unit tests
const Engine = require('./pcc_social_work_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_social_work engine tests:');
it('Asm', () => assertEq(Engine.Assessment({ t: 'psychosocial' }).plan, 'psychosocial-assessment'));
it('Plt', () => assertEq(Engine.Placement({ t: 'SNF' }).plan, 'SNF-placement'));
it('Psc', () => assertEq(Engine.Psychosocial({ t: 'crisis' }).plan, 'psychosocial-crisis'));
it('Saf', () => assertEq(Engine.Saf({ t: 'concern' }).plan, 'safety-concern'));
it('Fin', () => assertEq(Engine.Financial({ t: 'assistance' }).plan, 'financial-assistance'));
it('Trp', () => assertEq(Engine.Transport({ t: 'needed' }).plan, 'transport-assistance'));
it('Fam', () => assertEq(Engine.Family({ t: 'conflict' }).plan, 'family-conflict'));
it('Abs', () => assertEq(Engine.Abuse({ t: 'suspected' }).plan, 'suspected-abuse'));
it('Sub', () => assertEq(Engine.Substance({ t: 'concern' }).plan, 'substance-concern'));
it('Rsc', () => assertEq(Engine.Resources({ t: 'needed' }).plan, 'community-resources'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
