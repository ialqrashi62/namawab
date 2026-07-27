// P3-DC pcc_lifestyle_medicine unit tests
const Engine = require('./pcc_lifestyle_medicine_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_lifestyle_medicine engine tests:');
it('PhysicalActivity', () => assertEq(Engine.PhysicalActivity({ t: 'yes' }).plan, 'physicalactivity-protocol'));
it('NutritionHabits', () => assertEq(Engine.NutritionHabits({ t: 'yes' }).plan, 'nutritionhabits-protocol'));
it('SleepHygiene', () => assertEq(Engine.SleepHygiene({ t: 'yes' }).plan, 'sleephygiene-protocol'));
it('StressManagement', () => assertEq(Engine.StressManagement({ t: 'yes' }).plan, 'stressmanagement-protocol'));
it('SocialConnection', () => assertEq(Engine.SocialConnection({ t: 'yes' }).plan, 'socialconnection-protocol'));
it('SubstanceUse', () => assertEq(Engine.SubstanceUse({ t: 'yes' }).plan, 'substanceuse-protocol'));
it('Mindfulness', () => assertEq(Engine.Mindfulness({ t: 'yes' }).plan, 'mindfulness-protocol'));
it('WorkLifeBalance', () => assertEq(Engine.WorkLifeBalance({ t: 'yes' }).plan, 'worklifebalance-protocol'));
it('NatureExposure', () => assertEq(Engine.NatureExposure({ t: 'yes' }).plan, 'natureexposure-protocol'));
it('PurposeAndMeaning', () => assertEq(Engine.PurposeAndMeaning({ t: 'yes' }).plan, 'purposeandmeaning-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
