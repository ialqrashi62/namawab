// P3-EH pcc_voice_swallowing unit tests
const Engine = require('./pcc_voice_swallowing_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_voice_swallowing engine tests:');
it('VocalCordNoduleEvaluation', () => assertEq(Engine.VocalCordNoduleEvaluation({ t: 'yes' }).plan, 'vocalCordNoduleEvaluation-protocol'));
it('LaryngopharyngealReflux', () => assertEq(Engine.LaryngopharyngealReflux({ t: 'yes' }).plan, 'laryngopharyngealReflux-protocol'));
it('MuscleTensionDysphonia', () => assertEq(Engine.MuscleTensionDysphonia({ t: 'yes' }).plan, 'muscleTensionDysphonia-protocol'));
it('SpasmodicDysphonia', () => assertEq(Engine.SpasmodicDysphonia({ t: 'yes' }).plan, 'spasmodicDysphonia-protocol'));
it('VocalCordParalysis', () => assertEq(Engine.VocalCordParalysis({ t: 'yes' }).plan, 'vocalCordParalysis-protocol'));
it('SubglotticStenosis', () => assertEq(Engine.SubglotticStenosis({ t: 'yes' }).plan, 'subglotticStenosis-protocol'));
it('TracheoesophagealFistula', () => assertEq(Engine.TracheoesophagealFistula({ t: 'yes' }).plan, 'tracheoesophagealFistula-protocol'));
it('ZenkerDiverticulum', () => assertEq(Engine.ZenkerDiverticulum({ t: 'yes' }).plan, 'zenkerDiverticulum-protocol'));
it('DysphagiaSwallowEval', () => assertEq(Engine.DysphagiaSwallowEval({ t: 'yes' }).plan, 'dysphagiaSwallowEval-protocol'));
it('VocalCordPolyps', () => assertEq(Engine.VocalCordPolyps({ t: 'yes' }).plan, 'vocalCordPolyps-protocol'));
it('VoiceTherapyProtocol', () => assertEq(Engine.VoiceTherapyProtocol({ t: 'yes' }).plan, 'voiceTherapyProtocol-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
