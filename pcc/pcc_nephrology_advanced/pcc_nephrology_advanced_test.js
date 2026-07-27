// P3-DN pcc_nephrology_advanced unit tests
const Engine = require('./pcc_nephrology_advanced_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_nephrology_advanced engine tests:');
it('ProteinuriaWorkup', () => assertEq(Engine.ProteinuriaWorkup({ t: 'yes' }).plan, 'proteinuriaworkup-protocol'));
it('HematuriaEvaluation', () => assertEq(Engine.HematuriaEvaluation({ t: 'yes' }).plan, 'hematuriaevaluation-protocol'));
it('NephroticSyndrome', () => assertEq(Engine.NephroticSyndrome({ t: 'yes' }).plan, 'nephroticsyndrome-protocol'));
it('NephriticSyndrome', () => assertEq(Engine.NephriticSyndrome({ t: 'yes' }).plan, 'nephriticsyndrome-protocol'));
it('RapidlyProgressiveGN', () => assertEq(Engine.RapidlyProgressiveGN({ t: 'yes' }).plan, 'rapidlyprogressivegn-protocol'));
it('DiabeticNephropathy', () => assertEq(Engine.DiabeticNephropathy({ t: 'yes' }).plan, 'diabeticnephropathy-protocol'));
it('HypertensiveNephrosclerosis', () => assertEq(Engine.HypertensiveNephrosclerosis({ t: 'yes' }).plan, 'hypertensivenephrosclerosis-protocol'));
it('PolycysticKidneyDisease', () => assertEq(Engine.PolycysticKidneyDisease({ t: 'yes' }).plan, 'polycystickidneydisease-protocol'));
it('RenalArteryStenosis', () => assertEq(Engine.RenalArteryStenosis({ t: 'yes' }).plan, 'renalarterystenosis-protocol'));
it('ChronicKidneyDiseaseProgression', () => assertEq(Engine.ChronicKidneyDiseaseProgression({ t: 'yes' }).plan, 'chronickidneydiseaseprogression-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
