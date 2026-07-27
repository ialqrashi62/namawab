// P3-EF pcc_pediatric_nephrology unit tests
const Engine = require('./pcc_pediatric_nephrology_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_nephrology engine tests:');
it('NephroticSyndromeChild', () => assertEq(Engine.NephroticSyndromeChild({ t: 'yes' }).plan, 'nephroticSyndromeChild-protocol'));
it('PediatricUTIWorkup', () => assertEq(Engine.PediatricUTIWorkup({ t: 'yes' }).plan, 'pediatricUTIWorkup-protocol'));
it('HemolyticUremicSyndrome', () => assertEq(Engine.HemolyticUremicSyndrome({ t: 'yes' }).plan, 'hemolyticUremicSyndrome-protocol'));
it('ChronicKidneyDiseasePediatric', () => assertEq(Engine.ChronicKidneyDiseasePediatric({ t: 'yes' }).plan, 'chronicKidneyDiseasePediatric-protocol'));
it('RenalTubularAcidosis', () => assertEq(Engine.RenalTubularAcidosis({ t: 'yes' }).plan, 'renalTubularAcidosis-protocol'));
it('PolycysticKidneyDisease', () => assertEq(Engine.PolycysticKidneyDisease({ t: 'yes' }).plan, 'polycysticKidneyDisease-protocol'));
it('GlomerulonephritisPediatric', () => assertEq(Engine.GlomerulonephritisPediatric({ t: 'yes' }).plan, 'glomerulonephritisPediatric-protocol'));
it('HypertensionPediatric', () => assertEq(Engine.HypertensionPediatric({ t: 'yes' }).plan, 'hypertensionPediatric-protocol'));
it('DialysisPediatric', () => assertEq(Engine.DialysisPediatric({ t: 'yes' }).plan, 'dialysisPediatric-protocol'));
it('RenalTransplantPediatric', () => assertEq(Engine.RenalTransplantPediatric({ t: 'yes' }).plan, 'renalTransplantPediatric-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
