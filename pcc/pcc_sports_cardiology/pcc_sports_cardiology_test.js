// P3-DW pcc_sports_cardiology unit tests
const Engine = require('./pcc_sports_cardiology_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_sports_cardiology engine tests:');
it('AthleteECGInterpretation', () => assertEq(Engine.AthleteECGInterpretation({ t: 'yes' }).plan, 'athleteECGInterpretation-protocol'));
it('PreParticipationCardiacScreen', () => assertEq(Engine.PreParticipationCardiacScreen({ t: 'yes' }).plan, 'preParticipationCardiacScreen-protocol'));
it('HypertrophicCardiomyopathyRisk', () => assertEq(Engine.HypertrophicCardiomyopathyRisk({ t: 'yes' }).plan, 'hypertrophicCardiomyopathyRisk-protocol'));
it('MarfanSyndromeScreen', () => assertEq(Engine.MarfanSyndromeScreen({ t: 'yes' }).plan, 'marfanSyndromeScreen-protocol'));
it('CommotioCordisRisk', () => assertEq(Engine.CommotioCordisRisk({ t: 'yes' }).plan, 'commotioCordisRisk-protocol'));
it('ExerciseStressTestProtocol', () => assertEq(Engine.ExerciseStressTestProtocol({ t: 'yes' }).plan, 'exerciseStressTestProtocol-protocol'));
it('AthleteECHOIndication', () => assertEq(Engine.AthleteECHOIndication({ t: 'yes' }).plan, 'athleteECHOIndication-protocol'));
it('CardiacRehabPhaseProgression', () => assertEq(Engine.CardiacRehabPhaseProgression({ t: 'yes' }).plan, 'cardiacRehabPhaseProgression-protocol'));
it('ReturnToPlayCardiac', () => assertEq(Engine.ReturnToPlayCardiac({ t: 'yes' }).plan, 'returnToPlayCardiac-protocol'));
it('SuddenCardiacDeathScreening', () => assertEq(Engine.SuddenCardiacDeathScreening({ t: 'yes' }).plan, 'suddenCardiacDeathScreening-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
