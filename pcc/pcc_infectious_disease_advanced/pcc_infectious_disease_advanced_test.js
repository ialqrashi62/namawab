// P3-DM pcc_infectious_disease_advanced unit tests
const Engine = require('./pcc_infectious_disease_advanced_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_infectious_disease_advanced engine tests:');
it('FeverOfUnknownOrigin', () => assertEq(Engine.FeverOfUnknownOrigin({ t: 'yes' }).plan, 'feverofunknownorigin-protocol'));
it('TravelRelatedInfection', () => assertEq(Engine.TravelRelatedInfection({ t: 'yes' }).plan, 'travelrelatedinfection-protocol'));
it('ImmunocompromisedHost', () => assertEq(Engine.ImmunocompromisedHost({ t: 'yes' }).plan, 'immunocompromisedhost-protocol'));
it('HealthcareAssociatedInfection', () => assertEq(Engine.HealthcareAssociatedInfection({ t: 'yes' }).plan, 'healthcareassociatedinfection-protocol'));
it('ZoonoticDisease', () => assertEq(Engine.ZoonoticDisease({ t: 'yes' }).plan, 'zoonoticdisease-protocol'));
it('VectorBorneDisease', () => assertEq(Engine.VectorBorneDisease({ t: 'yes' }).plan, 'vectorbornedisease-protocol'));
it('FungalInfectionWorkup', () => assertEq(Engine.FungalInfectionWorkup({ t: 'yes' }).plan, 'fungalinfectionworkup-protocol'));
it('MycobacterialDisease', () => assertEq(Engine.MycobacterialDisease({ t: 'yes' }).plan, 'mycobacterialdisease-protocol'));
it('ViralHepatitisAdvanced', () => assertEq(Engine.ViralHepatitisAdvanced({ t: 'yes' }).plan, 'viralhepatitisadvanced-protocol'));
it('HIVOpportunisticInfection', () => assertEq(Engine.HIVOpportunisticInfection({ t: 'yes' }).plan, 'hivopportunisticinfection-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
