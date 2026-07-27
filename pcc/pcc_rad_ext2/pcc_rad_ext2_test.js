// P3-CI pcc_rad_ext2 unit tests
const Engine = require('./pcc_rad_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_rad_ext2 engine tests:');
it('Mod', () => assertEq(Engine.Modality({ t: 'MRI' }).plan, 'MRI-scan'));
it('BdP', () => assertEq(Engine.BodyPart({ p: 'head' }).plan, 'head-protocol'));
it('Ind', () => assertEq(Engine.Indication({ i: 'trauma' }).plan, 'trauma-protocol'));
it('Con', () => assertEq(Engine.Contrast({ c: 'IV' }).plan, 'IV-contrast'));
it('Urg', () => assertEq(Engine.Urgency({ u: 'stat' }).plan, 'stat-protocol'));
it('Cmp', () => assertEq(Engine.Comparison({ c: 'available' }).plan, 'compare-prior'));
it('Dos', () => assertEq(Engine.Dose({ ctdi: 35 }).plan, 'high-dose'));
it('Prg', () => assertEq(Engine.Pregnancy({ p: 'yes' }).plan, 'pregnancy-positive'));
it('Pdx', () => assertEq(Engine.Pediatric({ y: 8 }).plan, 'pediatric-protocol'));
it('Rep', () => assertEq(Engine.Report({ t: 'critical' }).plan, 'critical-result-call'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
