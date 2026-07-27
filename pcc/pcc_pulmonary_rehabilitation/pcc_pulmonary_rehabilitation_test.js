// P3-DK pcc_pulmonary_rehabilitation unit tests
const Engine = require('./pcc_pulmonary_rehabilitation_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pulmonary_rehabilitation engine tests:');
it('ExerciseCapacity', () => assertEq(Engine.ExerciseCapacity({ t: 'yes' }).plan, 'exercisecapacity-protocol'));
it('DyspneaIndex', () => assertEq(Engine.DyspneaIndex({ t: 'yes' }).plan, 'dyspneaindex-protocol'));
it('SixMinuteWalk', () => assertEq(Engine.SixMinuteWalk({ t: 'yes' }).plan, 'sixminutewalk-protocol'));
it('RehabAdherence', () => assertEq(Engine.RehabAdherence({ t: 'yes' }).plan, 'rehabadherence-protocol'));
it('InhalerTechnique', () => assertEq(Engine.InhalerTechnique({ t: 'yes' }).plan, 'inhalertechnique-protocol'));
it('AirwayClearance', () => assertEq(Engine.AirwayClearance({ t: 'yes' }).plan, 'airwayclearance-protocol'));
it('PulmonaryEducation', () => assertEq(Engine.PulmonaryEducation({ t: 'yes' }).plan, 'pulmonaryeducation-protocol'));
it('SmokingCessation', () => assertEq(Engine.SmokingCessation({ t: 'yes' }).plan, 'smokingcessation-protocol'));
it('NutritionPulmonary', () => assertEq(Engine.NutritionPulmonary({ t: 'yes' }).plan, 'nutritionpulmonary-protocol'));
it('PsychosocialScreen', () => assertEq(Engine.PsychosocialScreen({ t: 'yes' }).plan, 'psychosocialscreen-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
