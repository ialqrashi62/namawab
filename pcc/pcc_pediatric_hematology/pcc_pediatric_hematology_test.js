// P3-EF pcc_pediatric_hematology unit tests
const Engine = require('./pcc_pediatric_hematology_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_hematology engine tests:');
it('ChildhoodAnemiaWorkup', () => assertEq(Engine.ChildhoodAnemiaWorkup({ t: 'yes' }).plan, 'childhoodAnemiaWorkup-protocol'));
it('SickleCellDiseaseManagement', () => assertEq(Engine.SickleCellDiseaseManagement({ t: 'yes' }).plan, 'sickleCellDiseaseManagement-protocol'));
it('ThalassemiaSyndromes', () => assertEq(Engine.ThalassemiaSyndromes({ t: 'yes' }).plan, 'thalassemiaSyndromes-protocol'));
it('PediatricThrombocytopenia', () => assertEq(Engine.PediatricThrombocytopenia({ t: 'yes' }).plan, 'pediatricThrombocytopenia-protocol'));
it('HemophiliaManagement', () => assertEq(Engine.HemophiliaManagement({ t: 'yes' }).plan, 'hemophiliaManagement-protocol'));
it('VonWillebrandDisease', () => assertEq(Engine.VonWillebrandDisease({ t: 'yes' }).plan, 'vonWillebrandDisease-protocol'));
it('PediatricLeukemiaSupport', () => assertEq(Engine.PediatricLeukemiaSupport({ t: 'yes' }).plan, 'pediatricLeukemiaSupport-protocol'));
it('BoneMarrowFailureSyndromes', () => assertEq(Engine.BoneMarrowFailureSyndromes({ t: 'yes' }).plan, 'boneMarrowFailureSyndromes-protocol'));
it('IronDeficiencyAnemia', () => assertEq(Engine.IronDeficiencyAnemia({ t: 'yes' }).plan, 'ironDeficiencyAnemia-protocol'));
it('NewbornHematologicScreening', () => assertEq(Engine.NewbornHematologicScreening({ t: 'yes' }).plan, 'newbornHematologicScreening-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
