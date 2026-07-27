// P3-CI pcc_lab_ext2 unit tests
const Engine = require('./pcc_lab_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_lab_ext2 engine tests:');
it('Cmp', () => assertEq(Engine.Comprehensive({ count: 8 }).plan, 'multipanel-cmp'));
it('Tox', () => assertEq(Engine.Toxicology({ screen: 'drug' }).plan, 'drugs-of-abuse'));
it('Mol', () => assertEq(Engine.Molecular({ t: 'PCR' }).plan, 'molecular-PCR'));
it('Ban', () => assertEq(Engine.Banked({ days: 30 }).plan, 'short-storage'));
it('Cnv', () => assertEq(Engine.Convenience({ t: 'drug-level' }).plan, 'trough-level'));
it('Ref', () => assertEq(Engine.Reference({ lab: 'external' }).plan, 'send-out'));
it('PoC', () => assertEq(Engine.PointOfCare({ place: 'bedside' }).plan, 'bedside-glucose'));
it('Qua', () => assertEq(Engine.Quality({ cv: 0.08 }).plan, 'high-precision'));
it('TAT', () => assertEq(Engine.Turnaround({ hr: 0.5 }).plan, 'stat-TAT'));
it('Cr', () => assertEq(Engine.Critical({ val: 'K-7' }).plan, 'panic-value-call'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
