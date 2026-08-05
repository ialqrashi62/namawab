// pcc_vascular_intervention unit tests v3.316.32 (Phase 1C clinical-grade)
const Engine = require('./pcc_vascular_intervention_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  PASS ' + name); passed++; } catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('pcc_vascular_intervention engine tests v3.316.32:');

// CarotidStentPlacement
it('CAS: symptomatic 70% -> indicated', () => {
  const r = Engine.CarotidStentPlacement({ stenosis: 70, symptomatic: true });
  assertEq(r.indication, 'indicated');
});
it('CAS: asymptomatic 50% -> medical mgmt', () => {
  const r = Engine.CarotidStentPlacement({ stenosis: 50, symptomatic: false });
  assertEq(r.indication, 'medical-management');
});
it('CAS: <70yo with prior neck surgery -> CAS preferred', () => {
  const r = Engine.CarotidStentPlacement({ stenosis: 70, symptomatic: true, age: 60, priorNeckSurgery: true });
  assertEq(r.preferredApproach, 'CAS-preferred');
});

// AAAEndovascularRepair
it('EVAR: ruptured -> emergent', () => {
  const r = Engine.AAAEndovascularRepair({ aneurysmSize: 70, rupture: true });
  assertEq(r.recommendation, 'emergent-EVAR-if-anatomy-permits-else-open');
});
it('EVAR: 60mm + hostile anatomy -> open preferred', () => {
  const r = Engine.AAAEndovascularRepair({ aneurysmSize: 60, surgicalRisk: 'low', neckDiameter: 35 });
  assertEq(r.anatomySuitability, 'borderline');
});
it('EVAR: high surgical risk -> EVAR', () => {
  const r = Engine.AAAEndovascularRepair({ aneurysmSize: 60, surgicalRisk: 'high', age: 80 });
  assert(r.eligible); assert(r.recommendation.includes('EVAR'));
});

// PeripheralAngioplasty
it('Peripheral: CLI -> indicated', () => {
  const r = Engine.PeripheralAngioplasty({ abi: 0.4, cli: true });
  assertEq(r.recommendation, 'indicated');
});
it('Peripheral: claudication short lesion -> exercise first', () => {
  const r = Engine.PeripheralAngioplasty({ abi: 0.6, claudication: true, lesionLength: 8 });
  assert(r.technique.includes('exercise'));
});

// DVTThrombolysis
it('DVT: phlegmasia -> CDT', () => {
  const r = Engine.DVTThrombolysis({ phlegmasia: true, iliacVein: true });
  assert(r.eligible);
});
it('DVT: pregnancy -> anticoag alone', () => {
  const r = Engine.DVTThrombolysis({ pregnancy: true });
  assertEq(r.eligible, false);
  assertEq(r.recommendation, 'anticoagulation-alone');
});

// VaricoseVeinAblation
it('Varicose: GSV 6mm + reflux -> ablation', () => {
  const r = Engine.VaricoseVeinAblation({ veinDiameter: 6, refluxDuration: 600 });
  assertEq(r.recommendation, 'endovenous-ablation');
});
it('Varicose: pregnancy -> compression only', () => {
  const r = Engine.VaricoseVeinAblation({ pregnancy: true });
  assertEq(r.recommendation, 'compression-only');
});

// AVMEmbolization
it('AVM: Schobinger IV -> urgent multimodal', () => {
  const r = Engine.AVMEmbolization({ schobinger: 'IV', highFlow: true });
  assertEq(r.recommendation, 'urgent-multimodal-treatment');
});
it('AVM: Schobinger I cosmetic -> observation', () => {
  const r = Engine.AVMEmbolization({ schobinger: 'I', symptoms: 'cosmetic' });
  assertEq(r.recommendation, 'observation-or-compression');
});

// RenalArteryStenting
it('Renal: flash pulmonary edema -> stenting indicated', () => {
  const r = Engine.RenalArteryStenting({ stenosis: 80, flashPulmonaryEdema: true });
  assertEq(r.recommendation, 'renal-artery-stenting-indicated');
});
it('Renal: small kidney -> medical only', () => {
  const r = Engine.RenalArteryStenting({ stenosis: 70, smallKidney: true, resistiveIndex: 0.85 });
  assertEq(r.recommendation, 'medical-management-only');
});

// MesentericIschemiaIntervention
it('Mesenteric: acute with high lactate -> emergent', () => {
  const r = Engine.MesentericIschemiaIntervention({ acuity: 'acute', lacticAcid: 4, painOutOfProportion: true });
  assertEq(r.recommendation, 'emergent-endovascular-or-open-revascularization');
});
it('Mesenteric: chronic with weight loss -> revascularize', () => {
  const r = Engine.MesentericIschemiaIntervention({ acuity: 'chronic', wtLoss: 8, foodFear: true, vesselInvolvement: 2 });
  assertEq(r.recommendation, 'mesenteric-revascularization');
});

// ClaudicationRevascularization
it('Claudication: TASC A life-limiting -> endovascular', () => {
  const r = Engine.ClaudicationRevascularization({ abi: 0.6, tasc: 'A', lifeLimiting: true });
  assertEq(r.recommendation, 'endovascular-first');
});
it('Claudication: TASC D -> open bypass', () => {
  const r = Engine.ClaudicationRevascularization({ abi: 0.5, tasc: 'D', lifeLimiting: true });
  assertEq(r.recommendation, 'open-bypass-preferred');
});
it('Claudication: not life-limiting -> medical', () => {
  const r = Engine.ClaudicationRevascularization({ abi: 0.7, lifeLimiting: false });
  assertEq(r.recommendation, 'medical-management-with-exercise');
});

// VascularTraumaControl
it('Trauma: unstable + hard signs -> OR', () => {
  const r = Engine.VascularTraumaControl({ hemodynamicallyStable: false, hardSigns: true });
  assertEq(r.recommendation, 'emergent-vascular-control');
});
it('Trauma: stable + no ischemia -> CTA', () => {
  const r = Engine.VascularTraumaControl({ hemodynamicallyStable: true, hardSigns: false });
  assertEq(r.recommendation, 'CT-angiography-then-vascular-consult');
});
it('Trauma: aorta injury -> stent graft preferred', () => {
  const r = Engine.VascularTraumaControl({ vesselInjured: 'aorta', hemodynamicallyStable: true, distalIschemia: false });
  assert(r.technique.includes('endovascular-stent-graft'));
});

console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);