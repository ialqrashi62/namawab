// P3-CF pcc_telemed unit tests
const Engine = require('./pcc_telemed_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_telemed engine tests:');
it('Vis', () => assertEq(Engine.Visit({ type: 'video' }).plan, 'video-visit'));
it('Cns', () => assertEq(Engine.Consent({ kind: 'written' }).plan, 'e-consent-signed'));
it('Con', () => assertEq(Engine.Connection({ q: 'hd' }).plan, 'HD-video-connection'));
it('Px', () => assertEq(Engine.Prescribe({ ctl: 'controlled' }).plan, 'DEA-controlled-rx'));
it('Chr', () => assertEq(Engine.Charting({ dur: 30 }).plan, 'detailed-note'));
it('Trg', () => assertEq(Engine.Triage({ ac: 1 }).plan, 'ED-referral'));
it('Rmb', () => assertEq(Engine.Reimburse({ src: 'medicare' }).plan, 'medicare-telemed-parity'));
it('Plt', () => assertEq(Engine.Platform({ type: 'hipaa' }).plan, 'HIPAA-platform'));
it('FU', () => assertEq(Engine.FollowUp({ d: 1 }).plan, 'next-day-FU'));
it('Aud', () => assertEq(Engine.Audit({ fy: 'HIPAA' }).plan, 'HIPAA-audit-log'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
