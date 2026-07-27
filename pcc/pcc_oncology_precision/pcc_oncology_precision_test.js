// P3-DV pcc_oncology_precision unit tests
const Engine = require('./pcc_oncology_precision_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_oncology_precision engine tests:');
it('TumorGenomicProfile', () => assertEq(Engine.TumorGenomicProfile({ t: 'yes' }).plan, 'tumorGenomicProfile-protocol'));
it('TargetedTherapySelection', () => assertEq(Engine.TargetedTherapySelection({ t: 'yes' }).plan, 'targetedTherapySelection-protocol'));
it('ImmunotherapyEligibility', () => assertEq(Engine.ImmunotherapyEligibility({ t: 'yes' }).plan, 'immunotherapyEligibility-protocol'));
it('LiquidBiopsy', () => assertEq(Engine.LiquidBiopsy({ t: 'yes' }).plan, 'liquidBiopsy-protocol'));
it('MolecularTumorBoard', () => assertEq(Engine.MolecularTumorBoard({ t: 'yes' }).plan, 'molecularTumorBoard-protocol'));
it('PARPInhibitorEligibility', () => assertEq(Engine.PARPInhibitorEligibility({ t: 'yes' }).plan, 'pARPInhibitorEligibility-protocol'));
it('BRCAtestingProtocol', () => assertEq(Engine.BRCAtestingProtocol({ t: 'yes' }).plan, 'bRCAtestingProtocol-protocol'));
it('NTRKFusionDetection', () => assertEq(Engine.NTRKFusionDetection({ t: 'yes' }).plan, 'nTRKFusionDetection-protocol'));
it('CirculatingTumorDNA', () => assertEq(Engine.CirculatingTumorDNA({ t: 'yes' }).plan, 'circulatingTumorDNA-protocol'));
it('PrecisionRadiationDosimetry', () => assertEq(Engine.PrecisionRadiationDosimetry({ t: 'yes' }).plan, 'precisionRadiationDosimetry-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
