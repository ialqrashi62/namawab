// P3-DF pcc_immune_health unit tests
const Engine = require('./pcc_immune_health_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_immune_health engine tests:');
it('ImmunePanel', () => assertEq(Engine.ImmunePanel({ t: 'yes' }).plan, 'immunepanel-protocol'));
it('VaccineResponse', () => assertEq(Engine.VaccineResponse({ t: 'yes' }).plan, 'vaccineresponse-protocol'));
it('AutoimmuneRisk', () => assertEq(Engine.AutoimmuneRisk({ t: 'yes' }).plan, 'autoimmunerisk-protocol'));
it('Immunodeficiency', () => assertEq(Engine.Immunodeficiency({ t: 'yes' }).plan, 'immunodeficiency-protocol'));
it('AllergyImmune', () => assertEq(Engine.AllergyImmune({ t: 'yes' }).plan, 'allergyimmune-protocol'));
it('InfectionSusceptibility', () => assertEq(Engine.InfectionSusceptibility({ t: 'yes' }).plan, 'infectionsusceptibility-protocol'));
it('ImmuneAging', () => assertEq(Engine.ImmuneAging({ t: 'yes' }).plan, 'immuneaging-protocol'));
it('Th1Th2Balance', () => assertEq(Engine.Th1Th2Balance({ t: 'yes' }).plan, 'th1th2balance-protocol'));
it('CytokineProfile', () => assertEq(Engine.CytokineProfile({ t: 'yes' }).plan, 'cytokineprofile-protocol'));
it('ImmuneSupportPlan', () => assertEq(Engine.ImmuneSupportPlan({ t: 'yes' }).plan, 'immunesupportplan-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
