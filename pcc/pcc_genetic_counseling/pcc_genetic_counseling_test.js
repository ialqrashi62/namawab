// P3-CY pcc_genetic_counseling unit tests
const Engine = require('./pcc_genetic_counseling_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_genetic_counseling engine tests:');
it('RiskAssessment', () => assertEq(Engine.RiskAssessment({ t: 'yes' }).plan, 'riskassessment-protocol'));
it('Pedigree', () => assertEq(Engine.Pedigree({ t: 'yes' }).plan, 'pedigree-protocol'));
it('CarrierScreen', () => assertEq(Engine.CarrierScreen({ t: 'yes' }).plan, 'carrierscreen-protocol'));
it('PrenatalTesting', () => assertEq(Engine.PrenatalTesting({ t: 'yes' }).plan, 'prenataltesting-protocol'));
it('CancerGenetics', () => assertEq(Engine.CancerGenetics({ t: 'yes' }).plan, 'cancergenetics-protocol'));
it('Pharmacogenomics', () => assertEq(Engine.Pharmacogenomics({ t: 'yes' }).plan, 'pharmacogenomics-protocol'));
it('VariantInterpretation', () => assertEq(Engine.VariantInterpretation({ t: 'yes' }).plan, 'variantinterpretation-protocol'));
it('Consent', () => assertEq(Engine.Consent({ t: 'yes' }).plan, 'consent-protocol'));
it('FamilyCommunication', () => assertEq(Engine.FamilyCommunication({ t: 'yes' }).plan, 'familycommunication-protocol'));
it('Referral', () => assertEq(Engine.Referral({ t: 'yes' }).plan, 'referral-protocol'));
console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
