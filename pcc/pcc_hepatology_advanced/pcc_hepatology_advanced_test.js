// P3-DO pcc_hepatology_advanced unit tests
const Engine = require('./pcc_hepatology_advanced_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_hepatology_advanced engine tests:');
it('AscitesRefractory', () => assertEq(Engine.AscitesRefractory({ t: 'yes' }).plan, 'ascitesrefractory-protocol'));
it('HepaticEncephalopathyRecurrent', () => assertEq(Engine.HepaticEncephalopathyRecurrent({ t: 'yes' }).plan, 'hepaticencephalopathyrecurrent-protocol'));
it('HepatorenalSyndrome', () => assertEq(Engine.HepatorenalSyndrome({ t: 'yes' }).plan, 'hepatorenalsyndrome-protocol'));
it('HepatopulmonarySyndrome', () => assertEq(Engine.HepatopulmonarySyndrome({ t: 'yes' }).plan, 'hepatopulmonarysyndrome-protocol'));
it('PortopulmonaryHypertension', () => assertEq(Engine.PortopulmonaryHypertension({ t: 'yes' }).plan, 'portopulmonaryhypertension-protocol'));
it('AcuteLiverFailure', () => assertEq(Engine.AcuteLiverFailure({ t: 'yes' }).plan, 'acuteliverfailure-protocol'));
it('AutoimmuneHepatitis', () => assertEq(Engine.AutoimmuneHepatitis({ t: 'yes' }).plan, 'autoimmunehepatitis-protocol'));
it('PrimaryBiliaryCholangitis', () => assertEq(Engine.PrimaryBiliaryCholangitis({ t: 'yes' }).plan, 'primarybiliarycholangitis-protocol'));
it('PrimarySclerosingCholangitis', () => assertEq(Engine.PrimarySclerosingCholangitis({ t: 'yes' }).plan, 'primarysclerosingcholangitis-protocol'));
it('LiverTransplantEvaluation', () => assertEq(Engine.LiverTransplantEvaluation({ t: 'yes' }).plan, 'livertransplantevaluation-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
