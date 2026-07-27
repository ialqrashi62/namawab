// P3-CT pcc_urgent_care unit tests
const Engine = require('./pcc_urgent_care_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_urgent_care engine tests:');
it('WI', () => assertEq(Engine.WalkIn({ t: 'fast-track' }).plan, 'fast-track-eligible'));
it('In', () => assertEq(Engine.InjuryType({ t: 'laceration' }).plan, 'laceration-repair'));
it('Il', () => assertEq(Engine.Illness({ t: 'flu' }).plan, 'flu-eval'));
it('St', () => assertEq(Engine.Stitches({ t: 'needed' }).plan, 'stitch-needed'));
it('Sp', () => assertEq(Engine.Splint({ t: 'applied' }).plan, 'splint-applied'));
it('Ne', () => assertEq(Engine.Neb({ t: 'asthma' }).plan, 'asthma-neb'));
it('Ek', () => assertEq(Engine.EkgUrgent({ t: 'positive' }).plan, 'EKG-positive'));
it('Xr', () => assertEq(Engine.XrayOnsite({ t: 'positive' }).plan, 'Xray-positive'));
it('Lb', () => assertEq(Engine.LabRapid({ t: 'rapid-flu' }).plan, 'rapid-flu-positive'));
it('Dc', () => assertEq(Engine.DcUrgent({ t: 'ED' }).plan, 'ED-transfer'));

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
