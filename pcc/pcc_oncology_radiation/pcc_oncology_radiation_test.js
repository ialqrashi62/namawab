// P3-EB pcc_oncology_radiation unit tests
const Engine = require('./pcc_oncology_radiation_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_oncology_radiation engine tests:');
it('RadiationTreatmentPlanning', () => assertEq(Engine.RadiationTreatmentPlanning({ t: 'yes' }).plan, 'radiationTreatmentPlanning-protocol'));
it('IMRTvsVMATSelection', () => assertEq(Engine.IMRTvsVMATSelection({ t: 'yes' }).plan, 'iMRTvsVMATSelection-protocol'));
it('StereotacticRadiosurgery', () => assertEq(Engine.StereotacticRadiosurgery({ t: 'yes' }).plan, 'stereotacticRadiosurgery-protocol'));
it('BrachytherapyIndication', () => assertEq(Engine.BrachytherapyIndication({ t: 'yes' }).plan, 'brachytherapyIndication-protocol'));
it('ProtonTherapyEligibility', () => assertEq(Engine.ProtonTherapyEligibility({ t: 'yes' }).plan, 'protonTherapyEligibility-protocol'));
it('RadiationToxicityGrading', () => assertEq(Engine.RadiationToxicityGrading({ t: 'yes' }).plan, 'radiationToxicityGrading-protocol'));
it('ConcurrentChemoradiation', () => assertEq(Engine.ConcurrentChemoradiation({ t: 'yes' }).plan, 'concurrentChemoradiation-protocol'));
it('PalliativeRadiation', () => assertEq(Engine.PalliativeRadiation({ t: 'yes' }).plan, 'palliativeRadiation-protocol'));
it('ReIrradiationProtocol', () => assertEq(Engine.ReIrradiationProtocol({ t: 'yes' }).plan, 'reIrradiationProtocol-protocol'));
it('RadiationPneumonitisRisk', () => assertEq(Engine.RadiationPneumonitisRisk({ t: 'yes' }).plan, 'radiationPneumonitisRisk-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
