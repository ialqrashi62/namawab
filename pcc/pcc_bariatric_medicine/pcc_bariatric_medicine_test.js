// P3-DY pcc_bariatric_medicine unit tests
const Engine = require('./pcc_bariatric_medicine_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_bariatric_medicine engine tests:');
it('BMIClassification', () => assertEq(Engine.BMIClassification({ t: 'yes' }).plan, 'bMIClassification-protocol'));
it('BariatricSurgeryEligibility', () => assertEq(Engine.BariatricSurgeryEligibility({ t: 'yes' }).plan, 'bariatricSurgeryEligibility-protocol'));
it('RouxEnYIndication', () => assertEq(Engine.RouxEnYIndication({ t: 'yes' }).plan, 'rouxEnYIndication-protocol'));
it('SleeveGastrectomySelection', () => assertEq(Engine.SleeveGastrectomySelection({ t: 'yes' }).plan, 'sleeveGastrectomySelection-protocol'));
it('GastricBypassRevision', () => assertEq(Engine.GastricBypassRevision({ t: 'yes' }).plan, 'gastricBypassRevision-protocol'));
it('PostBariatricNutrition', () => assertEq(Engine.PostBariatricNutrition({ t: 'yes' }).plan, 'postBariatricNutrition-protocol'));
it('BariatricPsychEval', () => assertEq(Engine.BariatricPsychEval({ t: 'yes' }).plan, 'bariatricPsychEval-protocol'));
it('WeightRegainManagement', () => assertEq(Engine.WeightRegainManagement({ t: 'yes' }).plan, 'weightRegainManagement-protocol'));
it('BariatricComplications', () => assertEq(Engine.BariatricComplications({ t: 'yes' }).plan, 'bariatricComplications-protocol'));
it('MetabolicSurgeryOutcomes', () => assertEq(Engine.MetabolicSurgeryOutcomes({ t: 'yes' }).plan, 'metabolicSurgeryOutcomes-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
