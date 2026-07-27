// P3-DM pcc_antimicrobial_stewardship unit tests
const Engine = require('./pcc_antimicrobial_stewardship_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_antimicrobial_stewardship engine tests:');
it('EmpiricAntibioticChoice', () => assertEq(Engine.EmpiricAntibioticChoice({ t: 'yes' }).plan, 'empiricantibioticchoice-protocol'));
it('DeEscalationReview', () => assertEq(Engine.DeEscalationReview({ t: 'yes' }).plan, 'deescalationreview-protocol'));
it('TherapeuticDrugMonitoring', () => assertEq(Engine.TherapeuticDrugMonitoring({ t: 'yes' }).plan, 'therapeuticdrugmonitoring-protocol'));
it('AllergyCrossReactivity', () => assertEq(Engine.AllergyCrossReactivity({ t: 'yes' }).plan, 'allergycrossreactivity-protocol'));
it('RenalDoseAdjustment', () => assertEq(Engine.RenalDoseAdjustment({ t: 'yes' }).plan, 'renaldoseadjustment-protocol'));
it('HepaticDoseAdjustment', () => assertEq(Engine.HepaticDoseAdjustment({ t: 'yes' }).plan, 'hepaticdoseadjustment-protocol'));
it('DrugInteractionCheck', () => assertEq(Engine.DrugInteractionCheck({ t: 'yes' }).plan, 'druginteractioncheck-protocol'));
it('CultureFollowUp', () => assertEq(Engine.CultureFollowUp({ t: 'yes' }).plan, 'culturefollowup-protocol'));
it('AntibioticSpectrum', () => assertEq(Engine.AntibioticSpectrum({ t: 'yes' }).plan, 'antibioticspectrum-protocol'));
it('StewardshipMetrics', () => assertEq(Engine.StewardshipMetrics({ t: 'yes' }).plan, 'stewardshipmetrics-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
