// P3-EP pcc_neuro_ext7 unit tests
const Engine = require('./pcc_neuro_ext7_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext7 engine tests:');
it('SpinalMuscularAtrophy', () => assertEq(Engine.SpinalMuscularAtrophy({ t: 'yes' }).plan, 'spinalMuscularAtrophy-protocol'));
it('BeckerMuscularDystrophy', () => assertEq(Engine.BeckerMuscularDystrophy({ t: 'yes' }).plan, 'beckerMuscularDystrophy-protocol'));
it('DuchenneMuscularDystrophy', () => assertEq(Engine.DuchenneMuscularDystrophy({ t: 'yes' }).plan, 'duchenneMuscularDystrophy-protocol'));
it('FacioscapulohumeralMD', () => assertEq(Engine.FacioscapulohumeralMD({ t: 'yes' }).plan, 'facioscapulohumeralMD-protocol'));
it('LimbGirdleMD', () => assertEq(Engine.LimbGirdleMD({ t: 'yes' }).plan, 'limbGirdleMD-protocol'));
it('OculopharyngealMD', () => assertEq(Engine.OculopharyngealMD({ t: 'yes' }).plan, 'oculopharyngealMD-protocol'));
it('MyotonicDystrophyExt', () => assertEq(Engine.MyotonicDystrophyExt({ t: 'yes' }).plan, 'myotonicDystrophyExt-protocol'));
it('CongenitalMyopathy', () => assertEq(Engine.CongenitalMyopathy({ t: 'yes' }).plan, 'congenitalMyopathy-protocol'));
it('MitochondrialMyopathy', () => assertEq(Engine.MitochondrialMyopathy({ t: 'yes' }).plan, 'mitochondrialMyopathy-protocol'));
it('InflammatoryMyopathy', () => assertEq(Engine.InflammatoryMyopathy({ t: 'yes' }).plan, 'inflammatoryMyopathy-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
