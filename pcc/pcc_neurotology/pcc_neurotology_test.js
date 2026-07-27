// P3-EG pcc_neurotology unit tests
const Engine = require('./pcc_neurotology_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neurotology engine tests:');
it('VertigoLocalization', () => assertEq(Engine.VertigoLocalization({ t: 'yes' }).plan, 'vertigoLocalization-protocol'));
it('AcousticNeuromaScreening', () => assertEq(Engine.AcousticNeuromaScreening({ t: 'yes' }).plan, 'acousticNeuromaScreening-protocol'));
it('CerebellarStrokeSyndromes', () => assertEq(Engine.CerebellarStrokeSyndromes({ t: 'yes' }).plan, 'cerebellarStrokeSyndromes-protocol'));
it('BrainstemStrokeSyndromes', () => assertEq(Engine.BrainstemStrokeSyndromes({ t: 'yes' }).plan, 'brainstemStrokeSyndromes-protocol'));
it('PosteriorFossaTumor', () => assertEq(Engine.PosteriorFossaTumor({ t: 'yes' }).plan, 'posteriorFossaTumor-protocol'));
it('HerpesZosterOticus', () => assertEq(Engine.HerpesZosterOticus({ t: 'yes' }).plan, 'herpesZosterOticus-protocol'));
it('VestibularNeuritis', () => assertEq(Engine.VestibularNeuritis({ t: 'yes' }).plan, 'vestibularNeuritis-protocol'));
it('Labyrinthitis', () => assertEq(Engine.Labyrinthitis({ t: 'yes' }).plan, 'labyrinthitis-protocol'));
it('OtotoxicMonitoringExtended', () => assertEq(Engine.OtotoxicMonitoringExtended({ t: 'yes' }).plan, 'ototoxicMonitoringExtended-protocol'));
it('TinnitusHabituationTherapy', () => assertEq(Engine.TinnitusHabituationTherapy({ t: 'yes' }).plan, 'tinnitusHabituationTherapy-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
