// P3-CL pcc_ortho_ext3 unit tests
const Engine = require('./pcc_ortho_ext3_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_ortho_ext3 engine tests:');
it('Fx', () => assertEq(Engine.Fx({ t: 'comminuted' }).plan, 'comminuted-ORIF'));
it('Jn', () => assertEq(Engine.Joint({ j: 'hip' }).plan, 'hip-arthroplasty'));
it('Sp', () => assertEq(Engine.Spine({ t: 'disc' }).plan, 'disc-herniation'));
it('Spo', () => assertEq(Engine.Sports({ t: 'ACL' }).plan, 'ACL-tear'));
it('Pdx', () => assertEq(Engine.Pediatric({ t: 'SCFE' }).plan, 'SCFE-pinning'));
it('Tu', () => assertEq(Engine.Tumor({ t: 'malignant' }).plan, 'sarcoma-workup'));
it('Hn', () => assertEq(Engine.Hand({ t: 'laceration' }).plan, 'hand-laceration-repair'));
it('Ft', () => assertEq(Engine.Foot({ t: 'diabetic' }).plan, 'diabetic-foot'));
it('Po', () => assertEq(Engine.Postop({ d: 7 }).plan, 'week-1-postop'));
it('Rb', () => assertEq(Engine.Rehab({ w: 12 }).plan, 'long-term-rehab'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
