// P3-EK pcc_ortho_ext unit tests
const Engine = require('./pcc_ortho_ext_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_ortho_ext engine tests:');
it('JointReplacementEval', () => assertEq(Engine.JointReplacementEval({ t: 'yes' }).plan, 'jointReplacementEval-protocol'));
it('HipFracturePathway', () => assertEq(Engine.HipFracturePathway({ t: 'yes' }).plan, 'hipFracturePathway-protocol'));
it('KneeArthroscopyIndication', () => assertEq(Engine.KneeArthroscopyIndication({ t: 'yes' }).plan, 'kneeArthroscopyIndication-protocol'));
it('ShoulderReplacement', () => assertEq(Engine.ShoulderReplacement({ t: 'yes' }).plan, 'shoulderReplacement-protocol'));
it('SpinalDecompression', () => assertEq(Engine.SpinalDecompression({ t: 'yes' }).plan, 'spinalDecompression-protocol'));
it('OrthopedicTraumaTriage', () => assertEq(Engine.OrthopedicTraumaTriage({ t: 'yes' }).plan, 'orthopedicTraumaTriage-protocol'));
it('PediatricFractureEval', () => assertEq(Engine.PediatricFractureEval({ t: 'yes' }).plan, 'pediatricFractureEval-protocol'));
it('OsteomyelitisWorkup', () => assertEq(Engine.OsteomyelitisWorkup({ t: 'yes' }).plan, 'osteomyelitisWorkup-protocol'));
it('BoneTumorWorkup', () => assertEq(Engine.BoneTumorWorkup({ t: 'yes' }).plan, 'boneTumorWorkup-protocol'));
it('CompartmentSyndromeCheck', () => assertEq(Engine.CompartmentSyndromeCheck({ t: 'yes' }).plan, 'compartmentSyndromeCheck-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
