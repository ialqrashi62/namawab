// P3-DM pcc_sepsis_advanced unit tests
const Engine = require('./pcc_sepsis_advanced_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_sepsis_advanced engine tests:');
it('SepsisRecognition', () => assertEq(Engine.SepsisRecognition({ t: 'yes' }).plan, 'sepsisrecognition-protocol'));
it('LactateGuidedResuscitation', () => assertEq(Engine.LactateGuidedResuscitation({ t: 'yes' }).plan, 'lactateguidedresuscitation-protocol'));
it('FluidResponsiveness', () => assertEq(Engine.FluidResponsiveness({ t: 'yes' }).plan, 'fluidresponsiveness-protocol'));
it('VasopressorSelection', () => assertEq(Engine.VasopressorSelection({ t: 'yes' }).plan, 'vasopressorselection-protocol'));
it('CorticosteroidSepsis', () => assertEq(Engine.CorticosteroidSepsis({ t: 'yes' }).plan, 'corticosteroidsepsis-protocol'));
it('SourceControlPlan', () => assertEq(Engine.SourceControlPlan({ t: 'yes' }).plan, 'sourcecontrolplan-protocol'));
it('EndOrganPerfusion', () => assertEq(Engine.EndOrganPerfusion({ t: 'yes' }).plan, 'endorganperfusion-protocol'));
it('SepsisBundleCompliance', () => assertEq(Engine.SepsisBundleCompliance({ t: 'yes' }).plan, 'sepsisbundlecompliance-protocol'));
it('PostSepsisFollowUp', () => assertEq(Engine.PostSepsisFollowUp({ t: 'yes' }).plan, 'postsepsisfollowup-protocol'));
it('SepsisReadmissionRisk', () => assertEq(Engine.SepsisReadmissionRisk({ t: 'yes' }).plan, 'sepsisreadmissionrisk-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
