// P3-EH pcc_pediatric_rheum unit tests
const Engine = require('./pcc_pediatric_rheum_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_rheum engine tests:');
it('JuvenileIdiopathicArthritis', () => assertEq(Engine.JuvenileIdiopathicArthritis({ t: 'yes' }).plan, 'juvenileIdiopathicArthritis-protocol'));
it('KawasakiDisease', () => assertEq(Engine.KawasakiDisease({ t: 'yes' }).plan, 'kawasakiDisease-protocol'));
it('HenochSchonleinPurpura', () => assertEq(Engine.HenochSchonleinPurpura({ t: 'yes' }).plan, 'henochSchonleinPurpura-protocol'));
it('PediatricSLE', () => assertEq(Engine.PediatricSLE({ t: 'yes' }).plan, 'pediatricSLE-protocol'));
it('JuvenileDermatomyositis', () => assertEq(Engine.JuvenileDermatomyositis({ t: 'yes' }).plan, 'juvenileDermatomyositis-protocol'));
it('PediatricVasculitis', () => assertEq(Engine.PediatricVasculitis({ t: 'yes' }).plan, 'pediatricVasculitis-protocol'));
it('PeriodicFeverSyndromes', () => assertEq(Engine.PeriodicFeverSyndromes({ t: 'yes' }).plan, 'periodicFeverSyndromes-protocol'));
it('PediatricScleroderma', () => assertEq(Engine.PediatricScleroderma({ t: 'yes' }).plan, 'pediatricScleroderma-protocol'));
it('PediatricBehcet', () => assertEq(Engine.PediatricBehcet({ t: 'yes' }).plan, 'pediatricBehcet-protocol'));
it('GrowingPainsEvaluation', () => assertEq(Engine.GrowingPainsEvaluation({ t: 'yes' }).plan, 'growingPainsEvaluation-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
