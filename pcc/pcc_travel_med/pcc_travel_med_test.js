// P3-CY pcc_travel_med unit tests
const Engine = require('./pcc_travel_med_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_travel_med engine tests:');
it('DestinationRisk', () => assertEq(Engine.DestinationRisk({ t: 'yes' }).plan, 'destinationrisk-protocol'));
it('VaccinationNeed', () => assertEq(Engine.VaccinationNeed({ t: 'yes' }).plan, 'vaccinationneed-protocol'));
it('MalariaProphylaxis', () => assertEq(Engine.MalariaProphylaxis({ t: 'yes' }).plan, 'malariaprophylaxis-protocol'));
it('TravelersDiarrhea', () => assertEq(Engine.TravelersDiarrhea({ t: 'yes' }).plan, 'travelersdiarrhea-protocol'));
it('JetLag', () => assertEq(Engine.JetLag({ t: 'yes' }).plan, 'jetlag-protocol'));
it('DvtRisk', () => assertEq(Engine.DvtRisk({ t: 'yes' }).plan, 'dvtrisk-protocol'));
it('Altitude', () => assertEq(Engine.Altitude({ t: 'yes' }).plan, 'altitude-protocol'));
it('DivingFitness', () => assertEq(Engine.DivingFitness({ t: 'yes' }).plan, 'divingfitness-protocol'));
it('PregnancyTravel', () => assertEq(Engine.PregnancyTravel({ t: 'yes' }).plan, 'pregnancytravel-protocol'));
it('ReturnEvaluation', () => assertEq(Engine.ReturnEvaluation({ t: 'yes' }).plan, 'returnevaluation-protocol'));
console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
