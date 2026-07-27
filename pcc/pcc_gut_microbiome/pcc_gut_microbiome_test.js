// P3-DE pcc_gut_microbiome unit tests
const Engine = require('./pcc_gut_microbiome_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_gut_microbiome engine tests:');
it('DysbiosisAssessment', () => assertEq(Engine.DysbiosisAssessment({ t: 'yes' }).plan, 'dysbiosisassessment-protocol'));
it('Probiotics', () => assertEq(Engine.Probiotics({ t: 'yes' }).plan, 'probiotics-protocol'));
it('Prebiotics', () => assertEq(Engine.Prebiotics({ t: 'yes' }).plan, 'prebiotics-protocol'));
it('FecalTransplant', () => assertEq(Engine.FecalTransplant({ t: 'yes' }).plan, 'fecaltransplant-protocol'));
it('SIBO', () => assertEq(Engine.SIBO({ t: 'yes' }).plan, 'sibo-protocol'));
it('LeakyGut', () => assertEq(Engine.LeakyGut({ t: 'yes' }).plan, 'leakygut-protocol'));
it('GutBrainAxis', () => assertEq(Engine.GutBrainAxis({ t: 'yes' }).plan, 'gutbrainaxis-protocol'));
it('MicrobiomeTesting', () => assertEq(Engine.MicrobiomeTesting({ t: 'yes' }).plan, 'microbiometesting-protocol'));
it('DietaryFiber', () => assertEq(Engine.DietaryFiber({ t: 'yes' }).plan, 'dietaryfiber-protocol'));
it('PostbioticTherapy', () => assertEq(Engine.PostbioticTherapy({ t: 'yes' }).plan, 'postbiotictherapy-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
