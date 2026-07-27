// P3-DQ pcc_pediatrics_advanced unit tests
const Engine = require('./pcc_pediatrics_advanced_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatrics_advanced engine tests:');
it('PediatricSepsisAdvanced', () => assertEq(Engine.PediatricSepsisAdvanced({ t: 'yes' }).plan, 'pediatricsepsisadvanced-protocol'));
it('DiabeticKetoacidosisPedi', () => assertEq(Engine.DiabeticKetoacidosisPedi({ t: 'yes' }).plan, 'diabeticketoacidosispedi-protocol'));
it('StatusEpilepticusPedi', () => assertEq(Engine.StatusEpilepticusPedi({ t: 'yes' }).plan, 'statusepilepticuspedi-protocol'));
it('BronchiolitisSevere', () => assertEq(Engine.BronchiolitisSevere({ t: 'yes' }).plan, 'bronchiolitissevere-protocol'));
it('PediatricAsthmaSevere', () => assertEq(Engine.PediatricAsthmaSevere({ t: 'yes' }).plan, 'pediatricasthmasevere-protocol'));
it('CongenitalHeartDisease', () => assertEq(Engine.CongenitalHeartDisease({ t: 'yes' }).plan, 'congenitalheartdisease-protocol'));
it('PediatricOncologyEmergencies', () => assertEq(Engine.PediatricOncologyEmergencies({ t: 'yes' }).plan, 'pediatriconcologyemergencies-protocol'));
it('InbornErrorsMetabolism', () => assertEq(Engine.InbornErrorsMetabolism({ t: 'yes' }).plan, 'inbornerrorsmetabolism-protocol'));
it('PediatricNeurocritical', () => assertEq(Engine.PediatricNeurocritical({ t: 'yes' }).plan, 'pediatricneurocritical-protocol'));
it('PediatricToxicology', () => assertEq(Engine.PediatricToxicology({ t: 'yes' }).plan, 'pediatrictoxicology-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
