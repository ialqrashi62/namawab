// pcc_vascular_intervention unit tests v3.316.32
const Engine = require('./pcc_vascular_intervention_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  PASS ' + name); passed++; } catch (e) { console.log('  FAIL ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_vascular_intervention engine tests v3.316.32:');
it('CAS: symptomatic 70% -> indicated', () => { const r = Engine.CarotidStentPlacement({ stenosis: 70, symptomatic: true }); assertEq(r.indication, 'indicated'); });
it('EVAR: ruptured -> emergent', () => { const r = Engine.AAAEndovascularRepair({ aneurysmSize: 70, rupture: true }); assertEq(r.recommendation, 'emergent-EVAR-if-anatomy-permits-else-open'); });
it('Peripheral: CLI -> indicated', () => { const r = Engine.PeripheralAngioplasty({ abi: 0.4, cli: true }); assertEq(r.recommendation, 'indicated'); });
it('DVT: phlegmasia -> CDT', () => { const r = Engine.DVTThrombolysis({ phlegmasia: true }); assert(r.eligible); });
it('Varicose: GSV 6mm -> ablation', () => { const r = Engine.VaricoseVeinAblation({ veinDiameter: 6, refluxDuration: 600 }); assertEq(r.recommendation, 'endovenous-ablation'); });
it('AVM: Schobinger IV -> urgent', () => { const r = Engine.AVMEmbolization({ schobinger: 'IV' }); assertEq(r.recommendation, 'urgent-multimodal-treatment'); });
it('Renal: flash edema -> stenting', () => { const r = Engine.RenalArteryStenting({ stenosis: 80, flashPulmonaryEdema: true }); assertEq(r.recommendation, 'renal-artery-stenting-indicated'); });
it('Mesenteric acute high lactate -> emergent', () => { const r = Engine.MesentericIschemiaIntervention({ acuity: 'acute', lacticAcid: 4, painOutOfProportion: true }); assertEq(r.recommendation, 'emergent-endovascular-or-open-revascularization'); });
it('Claudication TASC A life-limiting -> endovascular', () => { const r = Engine.ClaudicationRevascularization({ abi: 0.6, tasc: 'A', lifeLimiting: true }); assertEq(r.recommendation, 'endovascular-first'); });
it('Trauma: unstable + hard signs -> OR', () => { const r = Engine.VascularTraumaControl({ hemodynamicallyStable: false, hardSigns: true }); assertEq(r.recommendation, 'emergent-vascular-control'); });
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);