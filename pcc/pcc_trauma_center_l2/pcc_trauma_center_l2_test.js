// P3-DT pcc_trauma_center_l2 unit tests
const Engine = require('./pcc_trauma_center_l2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_trauma_center_l2 engine tests:');
it('ATLSPrimarySurvey', () => assertEq(Engine.ATLSPrimarySurvey({ t: 'yes' }).plan, 'aTLSPrimarySurvey-protocol'));
it('FASTExamIndication', () => assertEq(Engine.FASTExamIndication({ t: 'yes' }).plan, 'fASTExamIndication-protocol'));
it('PelvicFractureStability', () => assertEq(Engine.PelvicFractureStability({ t: 'yes' }).plan, 'pelvicFractureStability-protocol'));
it('BluntCardiacInjury', () => assertEq(Engine.BluntCardiacInjury({ t: 'yes' }).plan, 'bluntCardiacInjury-protocol'));
it('TraumaActivationCriteria', () => assertEq(Engine.TraumaActivationCriteria({ t: 'yes' }).plan, 'traumaActivationCriteria-protocol'));
it('MassiveTransfusionProtocol', () => assertEq(Engine.MassiveTransfusionProtocol({ t: 'yes' }).plan, 'massiveTransfusionProtocol-protocol'));
it('OpenFractureGustilo', () => assertEq(Engine.OpenFractureGustilo({ t: 'yes' }).plan, 'openFractureGustilo-protocol'));
it('TraumaticBrainInjuryGCS', () => assertEq(Engine.TraumaticBrainInjuryGCS({ t: 'yes' }).plan, 'traumaticBrainInjuryGCS-protocol'));
it('SpineClearanceNEXUS', () => assertEq(Engine.SpineClearanceNEXUS({ t: 'yes' }).plan, 'spineClearanceNEXUS-protocol'));
it('BurnParklandEstimate', () => assertEq(Engine.BurnParklandEstimate({ t: 'yes' }).plan, 'burnParklandEstimate-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
