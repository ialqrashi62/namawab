// P3-ES pcc_pediatric_cardio_ext2 unit tests
const Engine = require('./pcc_pediatric_cardio_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_cardio_ext2 engine tests:');
it('PediatricASDEval', () => assertEq(Engine.PediatricASDEval({ t: 'yes' }).plan, 'pediatricASDEval-protocol'));
it('PediatricVSDPostRepair', () => assertEq(Engine.PediatricVSDPostRepair({ t: 'yes' }).plan, 'pediatricVSDPostRepair-protocol'));
it('PediatricAVCanal', () => assertEq(Engine.PediatricAVCanal({ t: 'yes' }).plan, 'pediatricAVCanal-protocol'));
it('PediatricTOFRepair', () => assertEq(Engine.PediatricTOFRepair({ t: 'yes' }).plan, 'pediatricTOFRepair-protocol'));
it('PediatricTranspositionGreatArteries', () => assertEq(Engine.PediatricTranspositionGreatArteries({ t: 'yes' }).plan, 'pediatricTranspositionGreatArteries-protocol'));
it('PediatricTruncusArteriosus', () => assertEq(Engine.PediatricTruncusArteriosus({ t: 'yes' }).plan, 'pediatricTruncusArteriosus-protocol'));
it('PediatricTAPVR', () => assertEq(Engine.PediatricTAPVR({ t: 'yes' }).plan, 'pediatricTAPVR-protocol'));
it('PediatricHLHS', () => assertEq(Engine.PediatricHLHS({ t: 'yes' }).plan, 'pediatricHLHS-protocol'));
it('PediatricCoarctationAorta', () => assertEq(Engine.PediatricCoarctationAorta({ t: 'yes' }).plan, 'pediatricCoarctationAorta-protocol'));
it('PediatricEbsteinAnomaly', () => assertEq(Engine.PediatricEbsteinAnomaly({ t: 'yes' }).plan, 'pediatricEbsteinAnomaly-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
