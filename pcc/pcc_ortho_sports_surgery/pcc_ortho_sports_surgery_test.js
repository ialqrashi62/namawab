// P3-DU pcc_ortho_sports_surgery unit tests
const Engine = require('./pcc_ortho_sports_surgery_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_ortho_sports_surgery engine tests:');
it('ACLRRepair', () => assertEq(Engine.ACLRRepair({ t: 'yes' }).plan, 'aCLRRepair-protocol'));
it('RotatorCuffRepair', () => assertEq(Engine.RotatorCuffRepair({ t: 'yes' }).plan, 'rotatorCuffRepair-protocol'));
it('MeniscusRepair', () => assertEq(Engine.MeniscusRepair({ t: 'yes' }).plan, 'meniscusRepair-protocol'));
it('HipArthroscopy', () => assertEq(Engine.HipArthroscopy({ t: 'yes' }).plan, 'hipArthroscopy-protocol'));
it('AchillesTendonRepair', () => assertEq(Engine.AchillesTendonRepair({ t: 'yes' }).plan, 'achillesTendonRepair-protocol'));
it('ShoulderInstability', () => assertEq(Engine.ShoulderInstability({ t: 'yes' }).plan, 'shoulderInstability-protocol'));
it('TennisElbowRelease', () => assertEq(Engine.TennisElbowRelease({ t: 'yes' }).plan, 'tennisElbowRelease-protocol'));
it('HipReplacementIndication', () => assertEq(Engine.HipReplacementIndication({ t: 'yes' }).plan, 'hipReplacementIndication-protocol'));
it('KneeReplacementIndication', () => assertEq(Engine.KneeReplacementIndication({ t: 'yes' }).plan, 'kneeReplacementIndication-protocol'));
it('SportInjuryReturnToPlay', () => assertEq(Engine.SportInjuryReturnToPlay({ t: 'yes' }).plan, 'sportInjuryReturnToPlay-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
