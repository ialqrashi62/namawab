// P3-EV pcc_neuro_ext13 unit tests
const Engine = require('./pcc_neuro_ext13_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neuro_ext13 engine tests:');
it('ParkinsonDiseaseExt', () => assertEq(Engine.ParkinsonDiseaseExt({ t: 'yes' }).plan, 'parkinsonDiseaseExt-protocol'));
it('ParkinsonPlusSyndromes', () => assertEq(Engine.ParkinsonPlusSyndromes({ t: 'yes' }).plan, 'parkinsonPlusSyndromes-protocol'));
it('MultisystemAtrophy', () => assertEq(Engine.MultisystemAtrophy({ t: 'yes' }).plan, 'multisystemAtrophy-protocol'));
it('ProgressiveSupranuclearPalsy', () => assertEq(Engine.ProgressiveSupranuclearPalsy({ t: 'yes' }).plan, 'progressiveSupranuclearPalsy-protocol'));
it('CorticobasalDegeneration', () => assertEq(Engine.CorticobasalDegeneration({ t: 'yes' }).plan, 'corticobasalDegeneration-protocol'));
it('LewyBodyDementiaExt', () => assertEq(Engine.LewyBodyDementiaExt({ t: 'yes' }).plan, 'lewyBodyDementiaExt-protocol'));
it('EssentialTremor', () => assertEq(Engine.EssentialTremor({ t: 'yes' }).plan, 'essentialTremor-protocol'));
it('DystoniaEval', () => assertEq(Engine.DystoniaEval({ t: 'yes' }).plan, 'dystoniaEval-protocol'));
it('TardiveDyskinesia', () => assertEq(Engine.TardiveDyskinesia({ t: 'yes' }).plan, 'tardiveDyskinesia-protocol'));
it('HuntingtonDiseaseExt', () => assertEq(Engine.HuntingtonDiseaseExt({ t: 'yes' }).plan, 'huntingtonDiseaseExt-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
