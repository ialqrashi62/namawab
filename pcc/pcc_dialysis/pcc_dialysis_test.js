// P3-DS pcc_dialysis unit tests
const Engine = require('./pcc_dialysis_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_dialysis engine tests:');
it('DialysisInitiation', () => assertEq(Engine.DialysisInitiation({ t: 'yes' }).plan, 'dialysisinitiation-protocol'));
it('HDAdequacyKtV', () => assertEq(Engine.HDAdequacyKtV({ t: 'yes' }).plan, 'hdadequacyktv-protocol'));
it('PDAdequacyKtV', () => assertEq(Engine.PDAdequacyKtV({ t: 'yes' }).plan, 'pdadequacyktv-protocol'));
it('CRRTDose', () => assertEq(Engine.CRRTDose({ t: 'yes' }).plan, 'crrtdose-protocol'));
it('VascularAccess', () => assertEq(Engine.VascularAccess({ t: 'yes' }).plan, 'vascularaccess-protocol'));
it('DialysisHypotension', () => assertEq(Engine.DialysisHypotension({ t: 'yes' }).plan, 'dialysishypotension-protocol'));
it('DialysisDisequilibrium', () => assertEq(Engine.DialysisDisequilibrium({ t: 'yes' }).plan, 'dialysisdisequilibrium-protocol'));
it('HyperkalemiaDialysis', () => assertEq(Engine.HyperkalemiaDialysis({ t: 'yes' }).plan, 'hyperkalemiadialysis-protocol'));
it('ContrastNephropathyProphylaxis', () => assertEq(Engine.ContrastNephropathyProphylaxis({ t: 'yes' }).plan, 'contrastnephropathyprophylaxis-protocol'));
it('TransplantWaitlist', () => assertEq(Engine.TransplantWaitlist({ t: 'yes' }).plan, 'transplantwaitlist-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
