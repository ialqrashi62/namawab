// P3-DU pcc_pain_procedure_suite unit tests
const Engine = require('./pcc_pain_procedure_suite_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pain_procedure_suite engine tests:');
it('ProceduralSedation', () => assertEq(Engine.ProceduralSedation({ t: 'yes' }).plan, 'proceduralSedation-protocol'));
it('EpiduralBlock', () => assertEq(Engine.EpiduralBlock({ t: 'yes' }).plan, 'epiduralBlock-protocol'));
it('FacetJointInjection', () => assertEq(Engine.FacetJointInjection({ t: 'yes' }).plan, 'facetJointInjection-protocol'));
it('RadiofrequencyAblation', () => assertEq(Engine.RadiofrequencyAblation({ t: 'yes' }).plan, 'radiofrequencyAblation-protocol'));
it('SpinalCordStimulator', () => assertEq(Engine.SpinalCordStimulator({ t: 'yes' }).plan, 'spinalCordStimulator-protocol'));
it('IntrathecalPump', () => assertEq(Engine.IntrathecalPump({ t: 'yes' }).plan, 'intrathecalPump-protocol'));
it('NerveBlockPeripheral', () => assertEq(Engine.NerveBlockPeripheral({ t: 'yes' }).plan, 'nerveBlockPeripheral-protocol'));
it('TriggerPointInjection', () => assertEq(Engine.TriggerPointInjection({ t: 'yes' }).plan, 'triggerPointInjection-protocol'));
it('JointAspiration', () => assertEq(Engine.JointAspiration({ t: 'yes' }).plan, 'jointAspiration-protocol'));
it('PainProcedureConsciousSedation', () => assertEq(Engine.PainProcedureConsciousSedation({ t: 'yes' }).plan, 'painProcedureConsciousSedation-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
