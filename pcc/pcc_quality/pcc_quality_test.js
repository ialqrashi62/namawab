// P3-CE pcc_quality unit tests
const Engine = require('./pcc_quality_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_quality engine tests:');
it('Qual', () => assertEq(Engine.Quality({ score: 95 }).plan, 'excellence-tier'));
it('Ind', () => assertEq(Engine.Indicator({ catheter: 'central' }).plan, 'CLABSI-bundle'));
it('Aud', () => assertEq(Engine.Audit({ findings: 6 }).plan, 'major-findings'));
it('Saf', () => assertEq(Engine.Safety({ event: 'sentinel' }).plan, 'RCA-and-CEO'));
it('Perf', () => assertEq(Engine.Performance({ benchmark: 90 }).plan, 'top-decile'));
it('Imp', () => assertEq(Engine.Improvement({ method: 'lean' }).plan, 'lean-six-sigma'));
it('Peer', () => assertEq(Engine.Peer({ review: 'm&m' }).plan, 'M&M-conference'));
it('Cred', () => assertEq(Engine.Credentialing({ expiryDays: 10 }).plan, 'expiring-soon'));
it('Sat', () => assertEq(Engine.Satisfaction({ score: 90 }).plan, 'excellent-CSAT'));
it('Rep', () => assertEq(Engine.Report({ fy: 'quarterly' }).plan, 'quarterly-QAPI'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
