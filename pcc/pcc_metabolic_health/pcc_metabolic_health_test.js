// P3-DE pcc_metabolic_health unit tests
const Engine = require('./pcc_metabolic_health_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_metabolic_health engine tests:');
it('InsulinResistance', () => assertEq(Engine.InsulinResistance({ t: 'yes' }).plan, 'insulinresistance-protocol'));
it('GlucoseVariability', () => assertEq(Engine.GlucoseVariability({ t: 'yes' }).plan, 'glucosevariability-protocol'));
it('MetabolicSyndrome', () => assertEq(Engine.MetabolicSyndrome({ t: 'yes' }).plan, 'metabolicsyndrome-protocol'));
it('LipidProfile', () => assertEq(Engine.LipidProfile({ t: 'yes' }).plan, 'lipidprofile-protocol'));
it('FattyLiver', () => assertEq(Engine.FattyLiver({ t: 'yes' }).plan, 'fattyliver-protocol'));
it('KetogenicTherapy', () => assertEq(Engine.KetogenicTherapy({ t: 'yes' }).plan, 'ketogenictherapy-protocol'));
it('TimeRestrictedEating', () => assertEq(Engine.TimeRestrictedEating({ t: 'yes' }).plan, 'timerestrictedeating-protocol'));
it('ContinuousGlucose', () => assertEq(Engine.ContinuousGlucose({ t: 'yes' }).plan, 'continuousglucose-protocol'));
it('ThyroidMetabolism', () => assertEq(Engine.ThyroidMetabolism({ t: 'yes' }).plan, 'thyroidmetabolism-protocol'));
it('WeightSetPoint', () => assertEq(Engine.WeightSetPoint({ t: 'yes' }).plan, 'weightsetpoint-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
