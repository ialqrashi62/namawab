// P3-EL pcc_pediatric_imaging unit tests
const Engine = require('./pcc_pediatric_imaging_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_imaging engine tests:');
it('PediatricBrainMRI', () => assertEq(Engine.PediatricBrainMRI({ t: 'yes' }).plan, 'pediatricBrainMRI-protocol'));
it('PediatricCTHead', () => assertEq(Engine.PediatricCTHead({ t: 'yes' }).plan, 'pediatricCTHead-protocol'));
it('PediatricChestImaging', () => assertEq(Engine.PediatricChestImaging({ t: 'yes' }).plan, 'pediatricChestImaging-protocol'));
it('PediatricAbdomenImaging', () => assertEq(Engine.PediatricAbdomenImaging({ t: 'yes' }).plan, 'pediatricAbdomenImaging-protocol'));
it('PediatricSpineImaging', () => assertEq(Engine.PediatricSpineImaging({ t: 'yes' }).plan, 'pediatricSpineImaging-protocol'));
it('PediatricMusculoskeletalImaging', () => assertEq(Engine.PediatricMusculoskeletalImaging({ t: 'yes' }).plan, 'pediatricMusculoskeletalImaging-protocol'));
it('PediatricCardiacImaging', () => assertEq(Engine.PediatricCardiacImaging({ t: 'yes' }).plan, 'pediatricCardiacImaging-protocol'));
it('PediatricFetalImaging', () => assertEq(Engine.PediatricFetalImaging({ t: 'yes' }).plan, 'pediatricFetalImaging-protocol'));
it('PediatricUltrasound', () => assertEq(Engine.PediatricUltrasound({ t: 'yes' }).plan, 'pediatricUltrasound-protocol'));
it('PediatricNuclearMedicine', () => assertEq(Engine.PediatricNuclearMedicine({ t: 'yes' }).plan, 'pediatricNuclearMedicine-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
