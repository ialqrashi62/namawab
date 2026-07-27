// P3-DL pcc_sedation_analgesia unit tests
const Engine = require('./pcc_sedation_analgesia_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_sedation_analgesia engine tests:');
it('SedationScale', () => assertEq(Engine.SedationScale({ t: 'yes' }).plan, 'sedationscale-protocol'));
it('AnalgesiaScore', () => assertEq(Engine.AnalgesiaScore({ t: 'yes' }).plan, 'analgesiascore-protocol'));
it('DailySedationInterruption', () => assertEq(Engine.DailySedationInterruption({ t: 'yes' }).plan, 'dailysedationinterruption-protocol'));
it('Analgosedation', () => assertEq(Engine.Analgosedation({ t: 'yes' }).plan, 'analgosedation-protocol'));
it('WithdrawalAssessment', () => assertEq(Engine.WithdrawalAssessment({ t: 'yes' }).plan, 'withdrawalassessment-protocol'));
it('RegionalAnalgesia', () => assertEq(Engine.RegionalAnalgesia({ t: 'yes' }).plan, 'regionalanalgesia-protocol'));
it('OpioidSparing', () => assertEq(Engine.OpioidSparing({ t: 'yes' }).plan, 'opioidsparing-protocol'));
it('AgitationProtocol', () => assertEq(Engine.AgitationProtocol({ t: 'yes' }).plan, 'agitationprotocol-protocol'));
it('ProceduralSedation', () => assertEq(Engine.ProceduralSedation({ t: 'yes' }).plan, 'proceduralsedation-protocol'));
it('SedationWeaning', () => assertEq(Engine.SedationWeaning({ t: 'yes' }).plan, 'sedationweaning-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
