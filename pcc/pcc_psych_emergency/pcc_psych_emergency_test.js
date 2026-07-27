// P3-DT pcc_psych_emergency unit tests
const Engine = require('./pcc_psych_emergency_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_psych_emergency engine tests:');
it('ColumbiaSuicideSeverity', () => assertEq(Engine.ColumbiaSuicideSeverity({ t: 'yes' }).plan, 'columbiaSuicideSeverity-protocol'));
it('PHQ2PHQ9Triage', () => assertEq(Engine.PHQ2PHQ9Triage({ t: 'yes' }).plan, 'pHQ2PHQ9Triage-protocol'));
it('GAD7Triage', () => assertEq(Engine.GAD7Triage({ t: 'yes' }).plan, 'gAD7Triage-protocol'));
it('CIWATriage', () => assertEq(Engine.CIWATriage({ t: 'yes' }).plan, 'cIWATriage-protocol'));
it('DeliriumCAMICU', () => assertEq(Engine.DeliriumCAMICU({ t: 'yes' }).plan, 'deliriumCAMICU-protocol'));
it('AcutePsychosisScreen', () => assertEq(Engine.AcutePsychosisScreen({ t: 'yes' }).plan, 'acutePsychosisScreen-protocol'));
it('SubstanceIntoxicationTriage', () => assertEq(Engine.SubstanceIntoxicationTriage({ t: 'yes' }).plan, 'substanceIntoxicationTriage-protocol'));
it('RestraintIndication', () => assertEq(Engine.RestraintIndication({ t: 'yes' }).plan, 'restraintIndication-protocol'));
it('InvoluntaryHoldCriteria', () => assertEq(Engine.InvoluntaryHoldCriteria({ t: 'yes' }).plan, 'involuntaryHoldCriteria-protocol'));
it('PsychiatricDisposition', () => assertEq(Engine.PsychiatricDisposition({ t: 'yes' }).plan, 'psychiatricDisposition-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
